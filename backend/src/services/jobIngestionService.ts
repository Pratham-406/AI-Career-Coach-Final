import * as cheerio from 'cheerio';

export interface ExtractedRequirement {
  skill: string;
  description: string;
  importance: 'Critical' | 'Recommended' | 'Bonus';
  sourceExcerpt: string;
  sourceReference: string;
}

export interface IngestionResult {
  title: string;
  company: string;
  description: string;
  sourceUrl?: string;
  sourceType: 'url' | 'manual';
  location: string;
  type: string;
  salary: string;
  requirements: ExtractedRequirement[];
  detectedSkills: string[];
}

const COMMON_TECH_SKILLS = [
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Golang', 'Java', 'C++', 'C#', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
  'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express', 'NestJS', 'FastAPI', 'Django', 'Flask', 'Spring Boot',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'DynamoDB', 'SQLite', 'Prisma', 'TypeORM',
  'Docker', 'Kubernetes', 'Helm', 'Terraform', 'AWS', 'GCP', 'Azure', 'Linux', 'CI/CD', 'GitHub Actions', 'Jenkins',
  'Jest', 'Vitest', 'Cypress', 'Playwright', 'Pytest', 'JUnit', 'Mocha',
  'GraphQL', 'REST', 'gRPC', 'WebSockets', 'Kafka', 'RabbitMQ', 'Microservices', 'Distributed Systems'
];

export class JobIngestionService {
  /**
   * Fetches and parses a public job posting URL
   */
  public static async fetchJobFromUrl(url: string): Promise<{ rawText: string; title?: string; company?: string }> {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid URL protocol. Only HTTP and HTTPS URLs are supported.');
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job URL: HTTP ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Strip scripts, styles, forms, and navigation chrome
    $('script, style, noscript, nav, footer, header, svg, iframe, form, button').remove();

    // Try finding meta tags or title for company and position
    const metaTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const metaCompany = $('meta[property="og:site_name"]').attr('content') || '';

    // Extract main text content
    const rawText = $('body').text().replace(/\s+/g, ' ').trim();

    return {
      rawText: rawText.slice(0, 15000), // safe ceiling
      title: metaTitle ? metaTitle.split(/[-|–]/)[0].trim() : undefined,
      company: metaCompany || undefined,
    };
  }

  /**
   * Analyzes text and extracts structured job requirements
   */
  public static extractRequirementsFromText(
    text: string,
    providedTitle?: string,
    providedCompany?: string,
    sourceUrl?: string
  ): IngestionResult {
    const lines = text
      .split(/[\n\r•·\-\*]/)
      .map(l => l.trim())
      .filter(l => l.length > 10);

    const detectedSkills = new Set<string>();
    const requirements: ExtractedRequirement[] = [];

    // Scan for technology mentions and contextual sentences
    for (const skill of COMMON_TECH_SKILLS) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      const matchingLine = lines.find(l => regex.test(l));

      if (matchingLine) {
        detectedSkills.add(skill);

        const lower = matchingLine.toLowerCase();
        let importance: 'Critical' | 'Recommended' | 'Bonus' = 'Recommended';
        if (
          lower.includes('must') ||
          lower.includes('required') ||
          lower.includes('proficien') ||
          lower.includes('essential') ||
          lower.includes('solid') ||
          lower.includes('deep understanding')
        ) {
          importance = 'Critical';
        } else if (lower.includes('plus') || lower.includes('nice to have') || lower.includes('bonus') || lower.includes('preferred')) {
          importance = 'Bonus';
        }

        requirements.push({
          skill,
          description: matchingLine.slice(0, 200),
          importance,
          sourceExcerpt: matchingLine.slice(0, 150),
          sourceReference: sourceUrl ? `Extracted from ${new URL(sourceUrl).hostname}` : 'Job Description Source Section',
        });
      }
    }

    // Default title / company detection if not explicitly passed
    let title = providedTitle || 'Software Engineer';
    let company = providedCompany || 'Tech Company';

    if (!providedTitle) {
      const titleMatch = text.match(/(Senior|Junior|Staff|Principal|Lead|Full Stack|Backend|Frontend|DevOps|Cloud|Software|Systems)\s+(Software\s+)?(Engineer|Developer|Architect|Intern)/i);
      if (titleMatch) {
        title = titleMatch[0];
      }
    }

    return {
      title,
      company,
      description: text.slice(0, 5000),
      sourceUrl,
      sourceType: sourceUrl ? 'url' : 'manual',
      location: text.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid / On-site',
      type: text.toLowerCase().includes('intern') ? 'Internship' : 'Full-time',
      salary: '$100,000 - $140,000',
      requirements: requirements.slice(0, 12),
      detectedSkills: Array.from(detectedSkills),
    };
  }
}
