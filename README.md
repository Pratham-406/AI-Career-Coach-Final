> **Updated UI:** Start with [REDESIGN.md](REDESIGN.md) for the current run commands, design changes, executed checks and limitations. The original project documentation below is retained for reference; dependencies are not bundled in this source ZIP.

# AI Career Coach 🚀
### Full-Stack Hackathon Edition — Portfolio & Skill-Gap Intelligence Platform

**AI Career Coach** is a full-stack platform designed to help computer science students and early-career software engineers bridge the gap between their public code repositories and industry technical hiring standards. 

By analyzing code patterns, unit test coverage, containerization setups, and system architecture across connected GitHub repositories, AI Career Coach pinpoints critical skill gaps with **concrete code evidence**, tracks readiness progression over time, and connects candidates with high-compatibility internships and entry-level positions.

---

## 🏗️ Repository Architecture

The project is structured into two cleanly decoupled services:

```text
ridewaves/ (Root Workspace)
├── backend/
│   ├── src/
│   │   ├── config/env.ts              # Typed environment variables
│   │   ├── controllers/               # Auth, GitHub, Jobs, Assessment, Billing controllers
│   │   ├── data/mockStore.ts          # Comprehensive dataset for hackathon evaluation
│   │   ├── middleware/                # Error handling, request logger, Zod schema validation
│   │   ├── routes/                    # Modular REST routes & /api/health
│   │   ├── types/                     # Shared TypeScript models
│   │   ├── app.ts                     # Express pipeline & CORS configuration
│   │   └── server.ts                  # Server bootstrap & graceful shutdown
│   ├── dist/                          # Compiled CommonJS production build
│   ├── .env.example                   # Environment variable template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/                # Navbar, Footer, DisclaimerBanner, ToastContainer, GitHubIcon
│   │   ├── context/AuthContext.tsx    # Session auth state, Dark/Light mode toggle, notifications
│   │   ├── pages/                     # 9 fully responsive pages
│   │   │   ├── LandingPage.tsx        # Hero, interactive preview, features, 3-step walkthrough
│   │   │   ├── AuthPage.tsx           # Sign-in, registration, one-click demo candidate login
│   │   │   ├── DashboardPage.tsx      # Readiness score meter, Recharts radar & area charts
│   │   │   ├── RepositoriesPage.tsx   # AST scans, code quality rating, detected skills pills
│   │   │   ├── JobDiscoveryPage.tsx   # Search, match scoring, required vs missing skill pills
│   │   │   ├── SkillGapPage.tsx       # Evidence found vs missing, learning resources, action plans
│   │   │   ├── AssessmentHistoryPage.tsx # Evaluation timeline & score progression trendline
│   │   │   ├── PricingPage.tsx        # Explorer, Pro, Campus Partner tiers with annual toggle
│   │   │   └── BillingProfilePage.tsx # Candidate goals, plan status, simulated invoice history
│   │   ├── services/api.ts            # Resilient API client with seamless fallback support
│   │   ├── types/index.ts             # Navigation and domain types
│   │   ├── App.tsx                    # Page router and layout shell
│   │   ├── index.css                  # Tailwind CSS design system & glassmorphism tokens
│   │   └── main.tsx                   # React root entrypoint
│   ├── dist/                          # Vite production bundle
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore                         # Standard root ignore rules
└── README.md                          # Windows setup & technical documentation
```

---

## 💻 Exact Windows Setup Commands (PowerShell)

### Prerequisites
- **Node.js**: v18.0.0 or later (v24.21.0 verified)
- **npm**: v9.0.0 or later (v11.19.0 verified)
- **PowerShell** or Command Prompt on Windows

---

### 1. Backend Setup & Run

Open a PowerShell terminal in the repository root:

```powershell
# Navigate into the backend folder
cd backend

# Install dependencies (already pre-installed during initial build)
npm install

# Build TypeScript to dist/
npm run build

# Start the REST API server in development mode (with hot-reload)
npm run dev

# Alternatively, start the compiled production server
# npm start
```

The backend REST API will start at:
- **API URL:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`

---

### 2. Frontend Setup & Run

Open a **second** PowerShell terminal in the repository root:

```powershell
# Navigate into the frontend folder
cd frontend

# Install dependencies (already pre-installed during initial build)
npm install

# Build the frontend production bundle (validates TypeScript & Vite bundling)
npm run build

# Start the Vite local development server
npm run dev
```

The frontend application will start at:
- **Client App URL:** `http://localhost:5173`

---

## 🔍 Verified 9 Platform Pages

| # | Page | Description & Key Functionality |
|---|---|---|
| 1 | **Landing Page** | Hero section with gradient accents, live readiness score preview card, feature matrix, 3-step walkthrough, and primary CTAs. |
| 2 | **Login & Signup** | Tabbed auth interface with form validation, test notices, and a **One-Click Demo Sign In** button pre-configured for candidate *Alex Rivera*. |
| 3 | **Student Dashboard** | Radial career readiness gauge (82%), Recharts radar chart comparing current skills against benchmark, progression area chart, and high-impact action recommendations. |
| 4 | **GitHub Repositories** | Lists connected public repos (`eventflow-distributed-queue`, `campus-connect-platform`, etc.), code quality scores, detected skill tags, AI code insights, and simulated deep AST scan triggers. |
| 5 | **Job & Internship Discovery** | Curated software roles filtered by type (Full-time, Internship, Co-op) and remote status, showing percentage match scores, verified matching skills (green) vs missing gap skills (amber), and quick-apply modal. |
| 6 | **AI Skill-Gap Analysis with Evidence** | Target role benchmark comparison bar chart, evidence found in codebase citations (e.g. Dockerfile patterns, Redis queues), missing industry evidence, and links to recommended learning resources. |
| 7 | **Assessment History** | Chronological evaluation archive with score gain badges, historical feedback summaries, and a Recharts line graph tracking readiness trend over consecutive evaluations. |
| 8 | **Subscription Pricing** | Explorer (Free), Career Accelerator Pro ($12/mo or $99/yr), and Campus Partner tiers with monthly/annual billing cycle toggle and feature comparison matrix. |
| 9 | **Billing & Profile** | Editable candidate parameters (target role, experience level, GitHub handle), active tier badge, and a simulated invoice history table with PDF download triggers. |

---

## 📡 Backend REST API Endpoints

All endpoints return uniform JSON responses structured as `{ success: boolean, data?: any, meta?: { isMockData: boolean, timestamp: string } }`.

### System Health
- `GET /api/health` — Service status, uptime, node environment, and module readiness.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Validates input via Zod schema and generates simulated candidate session.
- `POST /api/auth/login` — Authenticates credentials and returns user payload with demo JWT.
- `GET /api/auth/me` — Fetches currently authenticated student profile.
- `PATCH /api/auth/profile` — Updates target role, experience level, and GitHub handle.

### GitHub Integration (`/api/github`)
- `GET /api/github/repos` — Returns analyzed repositories with quality score and detected skill tags.
- `POST /api/github/connect` — Validates public repository URL and queues for skill indexing.
- `POST /api/github/analyze` — Simulates AST parser & commit review on a specific repository.
- `GET /api/github/status` — Returns simulated webhook event listener and sync mode status.

### Job Matching (`/api/jobs`)
- `GET /api/jobs` — Filterable by search keyword (`?search=`), type (`?type=Internship`), and remote flag (`?remote=true`).
- `GET /api/jobs/:id` — Full details for an individual job posting.
- `GET /api/jobs/match/summary` — High-level match rate analytics against candidate portfolio.

### Assessment & Skill Gaps (`/api/assessment`)
- `GET /api/assessment/gap-analysis` — Full evidence comparison (evidenceFound, evidenceMissing, recommendation).
- `GET /api/assessment/history` — Historical evaluation records and score adjustments.
- `POST /api/assessment/trigger` — Re-evaluates connected repositories and generates a new evaluation snapshot.

### Billing & Subscription (`/api/billing`)
- `GET /api/billing/plans` — Available subscription tiers and feature lists.
- `POST /api/billing/checkout` — Generates a simulated Stripe test checkout session.
- `GET /api/billing/invoices` — List of candidate billing receipts.
- `POST /api/billing/cancel` — Simulates subscription renewal cancellation.

---

## 🛡️ Hackathon Evaluation & Transparency Notice

To ensure reviewers have a reliable, zero-friction demonstration without requiring third-party API keys or live credit card charges, all external third-party integrations are explicitly wired to realistic, representative datasets:

1. **GitHub App Webhook Listener**: Automatic repository change detection is simulated; clicking **"Deep AST Scan"** on any repository or **"Run Re-Assessment"** on the dashboard updates code scores and adds insights in real-time.
2. **AI Semantic Analysis**: Code evidence citations (e.g., verifying multi-stage Dockerfiles or missing Kubernetes Helm charts) reflect realistic AST evaluations designed for full-stack engineering rubrics.
3. **Stripe Billing**: Checkout sessions and invoice downloads operate in test simulation mode.
4. **Resilient Offline Fallback**: The frontend includes built-in fallback dataset handlers, ensuring all visual charts and interactive modals render seamlessly even if the backend is stopped.

---

## 🔐 Environment Variables Guide

Both `.env.example` files have been pre-populated with safe local development defaults. **Never commit real secrets or production API keys to source code.**

### Backend (`backend/.env.example`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=ai-career-coach-dev-secret-key-2026
JWT_EXPIRES_IN=7d
GITHUB_CLIENT_ID=placeholder_github_client_id
GITHUB_CLIENT_SECRET=placeholder_github_client_secret
OPENAI_API_KEY=placeholder_openai_api_key
STRIPE_SECRET_KEY=placeholder_stripe_secret_key
```

### Frontend (`frontend/.env.example`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_MOCK_FALLBACK=true
```

---

## 🧪 Testing and Verifying the Build

Both projects have been compiled and verified:

```powershell
# Verify backend TypeScript compilation:
cd backend
npm run build

# Verify frontend TypeScript and Vite bundling:
cd ../frontend
npm run build
```
