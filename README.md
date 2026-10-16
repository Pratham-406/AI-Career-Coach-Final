# AI Career Coach 🚀
### Full-Stack Hackathon Edition — Portfolio & Skill-Gap Intelligence Platform

**AI Career Coach** is a production-grade full-stack platform designed to help computer science students and early-career software engineers bridge the gap between their public code repositories and industry technical hiring standards.

---

## 🌟 The Five Compulsory Features (Completed & Verified)

| Step | Feature | Description | Code Location | Status |
|---|---|---|---|---|
| **Step 1** | **INGEST** | Reads real job postings from public URLs or raw descriptions, extracting technical requirements, qualifications, and source citations into PostgreSQL / SQLite. | `backend/src/services/jobIngestionService.ts`, `backend/src/controllers/jobController.ts`, `frontend/src/pages/JobDiscoveryPage.tsx` | **PASS (Verified)** |
| **Step 2** | **SCAN** | Inspects GitHub repositories via REST API, retrieving file trees, commit SHAs, dependencies, and concrete source code evidence with exact line numbers. | `backend/src/services/githubScannerService.ts`, `backend/src/controllers/githubController.ts`, `frontend/src/pages/RepositoriesPage.tsx` | **PASS (Verified)** |
| **Step 3** | **ANALYZE** | Compares repository code evidence against job requirements, categorizing skills into Strong, Partial, or Missing Evidence with transparent weighted scoring. | `backend/src/services/assessmentEngine.ts`, `backend/src/controllers/assessmentController.ts`, `frontend/src/pages/SkillGapPage.tsx` | **PASS (Verified)** |
| **Step 4** | **TRIGGER** | Verified GitHub push webhook listener with raw-body HMAC-SHA256 signature validation and duplicate delivery prevention. | `backend/src/controllers/githubController.ts#handleWebhook`, `backend/src/services/githubScannerService.ts#verifyWebhookSignature` | **PASS (Verified)** |
| **Step 5** | **REASSESS** | Automatically re-evaluates changed skills upon push, preserves before/after assessment snapshots, calculates real score differences, and pushes live updates via Server-Sent Events (SSE). | `backend/src/services/jobQueueService.ts`, `backend/src/services/eventService.ts`, `frontend/src/pages/DashboardPage.tsx`, `frontend/src/pages/AssessmentHistoryPage.tsx` | **PASS (Verified)** |

---

## 🏗️ Repository Architecture

```text
AI-Career-Coach-Redesigned/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma              # Local persistent SQLite schema
│   │   ├── schema.postgresql.prisma   # Production PostgreSQL schema
│   │   └── migrations_postgresql/     # Complete PostgreSQL SQL migration
│   ├── src/
│   │   ├── config/env.ts              # Typed environment variables
│   │   ├── db/
│   │   │   ├── prisma.ts              # PrismaClient singleton
│   │   │   └── seed.ts                # Real initial database seed script
│   │   ├── middleware/
│   │   │   ├── auth.ts                # JWT authentication middleware (requireAuth)
│   │   │   ├── errorHandler.ts        # Centralized HTTP error handler
│   │   │   ├── logger.ts              # Request logger
│   │   │   └── validate.ts            # Zod validation middleware
│   │   ├── services/
│   │   │   ├── jobIngestionService.ts # Step 1: URL/text requirement extractor
│   │   │   ├── githubScannerService.ts# Step 2 & 4: GitHub REST & HMAC verifier
│   │   │   ├── assessmentEngine.ts    # Step 3 & 5: Evidence vs requirement scorer
│   │   │   ├── jobQueueService.ts     # Step 5: Reliable background job queue
│   │   │   └── eventService.ts        # Step 5: Live Server-Sent Events (SSE)
│   │   ├── controllers/               # Auth, GitHub, Jobs, Assessment, Billing
│   │   ├── routes/                    # REST routes, /api/health, /api/events
│   │   ├── scripts/
│   │   │   ├── testFiveSteps.ts       # Automated 5-step verification test
│   │   │   └── testHealth.ts          # Backend health check
│   │   ├── app.ts                     # Express pipeline & rawBody capture
│   │   └── server.ts                  # Server bootstrap & seed runner
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/                # Navbar, Footer, IdentityImage, etc.
│   │   ├── context/AuthContext.tsx    # Real session auth, JWT handling, theme
│   │   ├── pages/                     # 9 fully responsive pages
│   │   │   ├── LandingPage.tsx        # Marketing overview & feature preview
│   │   │   ├── AuthPage.tsx           # Real email/password sign-in & register
│   │   │   ├── DashboardPage.tsx      # Real-time SSE score meter & Recharts
│   │   │   ├── RepositoriesPage.tsx   # AST scans, commit citations, evidence drawer
│   │   │   ├── JobDiscoveryPage.tsx   # Step 1: URL/text ingestion modal & target job
│   │   │   ├── SkillGapPage.tsx       # Step 3 & 5: Evidence comparison & re-assessment
│   │   │   ├── AssessmentHistoryPage.tsx # Before/after evaluation progression trendline
│   │   │   ├── PricingPage.tsx        # Subscription tiers
│   │   │   └── BillingProfilePage.tsx # Profile and goal settings
│   │   ├── services/api.ts            # API client with token headers & SSE listener
│   │   ├── types/index.ts             # Domain models
│   │   ├── App.tsx                    # Shell router
│   │   └── index.css                  # Tailwind CSS design system tokens
│   ├── package.json
│   └── vite.config.ts
│
├── package.json                       # Root workspace scripts
├── start-dev.ps1                      # 1-Click Windows PowerShell launcher
└── README.md
```

---

## ⚡ Quick Start (Windows PowerShell)

### Prerequisites
- Node.js (v18+ or v24)
- npm (v9+)

### Option A: 1-Click Launch (Recommended)
Run the included PowerShell script in the root directory:
```powershell
.\start-dev.ps1
```
This automatically verifies the database, populates seed data, and opens two parallel processes for backend and frontend.

### Option B: Manual Two-Terminal Startup

**Terminal 1 — Backend:**
```powershell
cd backend
npm install
npx prisma db push
npm run dev
```
Backend runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🧪 Automated Verification Suite

To run the automated test suite verifying all 5 compulsory steps:
```powershell
cd backend
npm run test:five-steps
```

**Expected output:**
```text
====================================================
🧪 RUNNING COMPREHENSIVE AUTOMATED VERIFICATION SUITE
====================================================

[TEST] Auth & Database Persistence:
  ✅ Real password hashing, verification, JWT signing and DB persistence passed.

[STEP 1 — INGEST] Testing job posting & requirement ingestion:
  ✅ Ingest Step Passed: Saved job "Cloud Systems Intern" with 7 requirements.

[STEP 2 — SCAN] Testing GitHub repository parsing & evidence extraction:
  ✅ Scan Step Passed: Stored commit SHA c8d4e92 with 2 evidence citations.

[STEP 3 — ANALYZE] Testing evidence vs job requirement gap analysis:
  ✅ Analyze Step Passed: Transparent score 62%. Strong: [TypeScript,Docker], Gaps: [Node.js,Kubernetes,Helm,Vitest].

[STEP 4 — TRIGGER] Testing GitHub push webhook HMAC verification & replay defense:
  ✅ Trigger Step Passed: Valid HMAC signature accepted; forged signature rejected.

[STEP 5 — REASSESS] Testing automated re-evaluation & before/after scoring:
  ✅ Reassess Step Passed: Before=62%, After=66%, Delta=+4%. Snapshot persisted.

====================================================
🏁 VERIFICATION COMPLETE: 5/5 COMPULSORY STEPS PASSED
====================================================
```

---

## 🗄️ Database Implementation

### Persistent Models Implemented:
1. **User**: Name, unique email, bcrypt password hash, careerReadinessScore, plan, targetRole.
2. **GitHubRepository**: User foreign key, repo URL, default branch, commit SHA, webhook status, detected skills, insights.
3. **JobPosting**: User foreign key, job title, company, description, source URL, sourceType, match score.
4. **JobRequirement**: JobPosting foreign key, required skill, description, importance (Critical/Recommended/Bonus), source excerpt, source reference.
5. **RepositoryScan**: Repository foreign key, commit SHA, scan status, detected technologies, file tree summary.
6. **CodeEvidence**: Scan foreign key, skill, file path, starting/ending line numbers, commit SHA, confidence, code snippet.
7. **Assessment**: User & Job foreign keys, overall score, previousAssessmentId, scoreChangeFromPrevious, summary feedback.
8. **SkillAssessment**: Assessment & Requirement foreign keys, skill name, category, score, evidenceStatus, explanation, recommendation, codeReference.
9. **GitHubWebhookEvent**: Unique GitHub delivery ID, repository foreign key, event type, commit SHA, payload, processing status.

### Switching from Local SQLite to PostgreSQL:
The project supports both SQLite for local zero-config testing and PostgreSQL for production:
1. In `backend/.env`, set:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/aicareercoach?schema=public"
   ```
2. Run Prisma migration:
   ```powershell
   npx prisma migrate deploy --schema=prisma/schema.postgresql.prisma
   ```

---

## 🔗 GitHub Push Webhook Setup

1. **Local Tunnel**: To receive GitHub webhooks locally on Windows, start an HTTPS tunnel (e.g., ngrok or Cloudflare tunnel):
   ```powershell
   ngrok http 5000
   ```
2. **GitHub Webhook Settings**:
   - Go to your repository on GitHub: `Settings` -> `Webhooks` -> `Add webhook`.
   - **Payload URL**: `https://<your-tunnel-subdomain>.ngrok-free.app/api/github/webhook`
   - **Content type**: `application/json`
   - **Secret**: Value of `GITHUB_WEBHOOK_SECRET` from `backend/.env` (default: `dev_github_webhook_secret_key_12345`).
   - **Events**: Select `Just the push event`.
3. When you push a commit, GitHub sends an authenticated `push` event. The backend validates the `X-Hub-Signature-256`, enqueues the repository scan, compares changed files, updates skill assessments, and broadcasts the new score to your live frontend dashboard!
