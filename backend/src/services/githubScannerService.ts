import crypto from 'crypto';
import { config } from '../config/env';

export interface GitHubRepoMeta {
  owner: string;
  repo: string;
  name: string;
  fullName: string;
  description: string;
  defaultBranch: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  latestCommitSha: string;
}

export interface ExtractedCodeEvidence {
  skill: string;
  filePath: string;
  startLine: number;
  endLine: number;
  commitSha: string;
  evidenceDescription: string;
  confidence: number;
  codeSnippet: string;
}

export interface ScanOutcome {
  commitSha: string;
  detectedSkills: string[];
  codeQualityScore: number;
  insights: string[];
  fileTreeSummary: string[];
  evidences: ExtractedCodeEvidence[];
}

export class GitHubScannerService {
  /**
   * Helper to make GitHub API calls with authorization if token is configured
   */
  private static async githubFetch(endpoint: string): Promise<any> {
    const url = endpoint.startsWith('http') ? endpoint : `https://api.github.com${endpoint}`;
    const headers: Record<string, string> = {
      'User-Agent': 'AI-Career-Coach-Engine/1.0',
      'Accept': 'application/vnd.github.v3+json',
    };

    if (config.githubToken) {
      headers['Authorization'] = `token ${config.githubToken}`;
    }

    const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`GitHub resource not found: ${url}`);
      }
      if (response.status === 403) {
        const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
        if (rateLimitRemaining === '0') {
          throw new Error('GitHub API rate limit exceeded. Please configure GITHUB_TOKEN in backend/.env for high-volume access.');
        }
      }
      throw new Error(`GitHub API error: HTTP ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Parses repository owner and name from any valid GitHub URL or identifier
   */
  public static parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
    const clean = repoUrl.trim().replace(/\.git$/, '').replace(/\/$/, '');
    const match = clean.match(/github\.com[/:]([^/]+)\/([^/]+)/) || clean.match(/^([^/]+)\/([^/]+)$/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL or format. Expected: https://github.com/owner/repo or owner/repo');
    }
    return { owner: match[1], repo: match[2] };
  }

  /**
   * Fetches real repository metadata and latest commit SHA
   */
  public static async fetchRepositoryMetadata(owner: string, repo: string): Promise<GitHubRepoMeta> {
    const data = await this.githubFetch(`/repos/${owner}/${repo}`);
    const defaultBranch = data.default_branch || 'main';

    let latestCommitSha = '';
    try {
      const commitData = await this.githubFetch(`/repos/${owner}/${repo}/commits/${defaultBranch}`);
      latestCommitSha = commitData.sha;
    } catch {
      latestCommitSha = '0000000000000000000000000000000000000000';
    }

    return {
      owner: data.owner?.login || owner,
      repo: data.name || repo,
      name: data.name || repo,
      fullName: data.full_name || `${owner}/${repo}`,
      description: data.description || 'Public GitHub repository connected to AI Career Coach',
      defaultBranch,
      language: data.language || 'TypeScript',
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      openIssues: data.open_issues_count || 0,
      latestCommitSha,
    };
  }

  /**
   * Scans repository files and extracts real source-code evidence
   */
  public static async scanRepository(owner: string, repo: string, commitSha: string): Promise<ScanOutcome> {
    let tree: any[] = [];
    try {
      const treeData = await this.githubFetch(`/repos/${owner}/${repo}/git/trees/${commitSha}?recursive=1`);
      if (treeData && treeData.tree && Array.isArray(treeData.tree)) {
        tree = treeData.tree;
      }
    } catch (err: any) {
      console.warn(`[scanRepository] Could not fetch recursive tree for ${owner}/${repo}: ${err.message}`);
    }

    const files = tree.filter(item => item.type === 'blob');
    const filePaths = files.map(f => f.path);

    const detectedSkills = new Set<string>();
    const evidences: ExtractedCodeEvidence[] = [];
    const insights: string[] = [];

    // Prioritize key manifests and source code files
    const priorityPaths = filePaths.filter(p => {
      const lower = p.toLowerCase();
      return (
        lower.includes('package.json') ||
        lower.includes('dockerfile') ||
        lower.includes('docker-compose') ||
        lower.includes('.github/workflows') ||
        lower.includes('requirements.txt') ||
        lower.includes('pyproject.toml') ||
        lower.includes('go.mod') ||
        lower.includes('cargo.toml') ||
        lower.includes('pom.xml') ||
        lower.includes('server.') ||
        lower.includes('app.') ||
        lower.includes('test') ||
        lower.includes('spec')
      );
    }).slice(0, 10); // inspect up to 10 key files

    for (const path of priorityPaths) {
      try {
        const fileContentData = await this.githubFetch(`/repos/${owner}/${repo}/contents/${path}?ref=${commitSha}`);
        if (!fileContentData.content || fileContentData.encoding !== 'base64') continue;

        const content = Buffer.from(fileContentData.content, 'base64').toString('utf8');
        const lines = content.split('\n');

        // Pattern scan for concrete evidence
        if (path.endsWith('package.json')) {
          try {
            const pkg = JSON.parse(content);
            const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

            if (allDeps['typescript']) {
              detectedSkills.add('TypeScript');
              evidences.push({
                skill: 'TypeScript',
                filePath: path,
                startLine: 1,
                endLine: Math.min(lines.length, 25),
                commitSha,
                evidenceDescription: `Configured TypeScript compiler and tooling in ${path}`,
                confidence: 95,
                codeSnippet: `"typescript": "${allDeps['typescript']}"`,
              });
            }
            if (allDeps['react']) detectedSkills.add('React');
            if (allDeps['express']) detectedSkills.add('Express');
            if (allDeps['@prisma/client'] || allDeps['prisma']) detectedSkills.add('Prisma');
            if (allDeps['jest'] || allDeps['vitest'] || allDeps['mocha']) {
              const testRunner = allDeps['jest'] ? 'Jest' : allDeps['vitest'] ? 'Vitest' : 'Mocha';
              detectedSkills.add(testRunner);
              detectedSkills.add('Unit Testing');
              evidences.push({
                skill: testRunner,
                filePath: path,
                startLine: 1,
                endLine: Math.min(lines.length, 30),
                commitSha,
                evidenceDescription: `Automated test runner configured with ${testRunner}`,
                confidence: 90,
                codeSnippet: `"${testRunner.toLowerCase()}": "${allDeps[testRunner.toLowerCase()]}"`,
              });
            }
            if (allDeps['redis'] || allDeps['ioredis']) detectedSkills.add('Redis');
            if (allDeps['pg'] || allDeps['pglite']) detectedSkills.add('PostgreSQL');
          } catch {}
        }

        if (path.toLowerCase().includes('dockerfile')) {
          detectedSkills.add('Docker');
          detectedSkills.add('Containerization');
          evidences.push({
            skill: 'Docker',
            filePath: path,
            startLine: 1,
            endLine: Math.min(lines.length, 25),
            commitSha,
            evidenceDescription: `Container build configuration verified in ${path}`,
            confidence: 92,
            codeSnippet: lines.slice(0, 5).join('\n'),
          });
        }

        if (path.toLowerCase().includes('.github/workflows')) {
          detectedSkills.add('CI/CD');
          detectedSkills.add('GitHub Actions');
          evidences.push({
            skill: 'CI/CD',
            filePath: path,
            startLine: 1,
            endLine: Math.min(lines.length, 20),
            commitSha,
            evidenceDescription: `Automated continuous integration pipeline configured via GitHub Actions in ${path}`,
            confidence: 94,
            codeSnippet: lines.slice(0, 6).join('\n'),
          });
        }

        if (path.toLowerCase().includes('test') || path.toLowerCase().includes('spec')) {
          detectedSkills.add('Automated Testing');
          evidences.push({
            skill: 'Automated Testing',
            filePath: path,
            startLine: 1,
            endLine: Math.min(lines.length, 20),
            commitSha,
            evidenceDescription: `Test suite implementation verified in ${path}`,
            confidence: 88,
            codeSnippet: lines.slice(0, 6).join('\n'),
          });
        }
      } catch (err: any) {
        console.warn(`[scanRepository] Could not inspect file ${path}: ${err.message}`);
      }
    }

    // Default heuristics if repository is minimal
    if (detectedSkills.size === 0) {
      detectedSkills.add('Git');
    }

    if (detectedSkills.has('TypeScript')) {
      insights.push('Strict type checking and interface contracts present.');
    }
    if (detectedSkills.has('Docker')) {
      insights.push('Containerization configuration present for reproducible environments.');
    }
    if (detectedSkills.has('CI/CD')) {
      insights.push('Continuous integration automation detected in GitHub workflows.');
    } else {
      insights.push('Recommended: Add .github/workflows CI pipeline to automate build and test checks.');
    }

    // Calculate transparent code quality score (baseline 70 + bonus for tests, docker, ci/cd)
    let codeQualityScore = 70;
    if (detectedSkills.has('TypeScript')) codeQualityScore += 6;
    if (detectedSkills.has('Docker')) codeQualityScore += 7;
    if (detectedSkills.has('CI/CD')) codeQualityScore += 8;
    if (detectedSkills.has('Automated Testing') || detectedSkills.has('Jest')) codeQualityScore += 7;
    codeQualityScore = Math.min(95, codeQualityScore);

    return {
      commitSha,
      detectedSkills: Array.from(detectedSkills),
      codeQualityScore,
      insights,
      fileTreeSummary: filePaths.slice(0, 30),
      evidences,
    };
  }

  /**
   * Verifies GitHub X-Hub-Signature-256 HMAC
   */
  public static verifyWebhookSignature(rawBody: string | Buffer, signatureHeader: string | undefined): boolean {
    if (!signatureHeader || !config.githubWebhookSecret) {
      return false;
    }

    const [algorithm, signature] = signatureHeader.split('=');
    if (algorithm !== 'sha256' || !signature) {
      return false;
    }

    const hmac = crypto.createHmac('sha256', config.githubWebhookSecret);
    const expectedSignature = hmac.update(rawBody).digest('hex');

    try {
      return crypto.timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(expectedSignature, 'utf8'));
    } catch {
      return false;
    }
  }
}
