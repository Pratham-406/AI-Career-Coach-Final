# Reference-based UI redesign

## Run locally (Windows PowerShell)
Open two terminals in the extracted `ridewaves.backup` folder. Install Node.js and npm first.

Terminal 1 — backend:
```powershell
cd backend
Copy-Item .env.example .env
npm ci
npm run build
npm run dev
```
Terminal 2 — frontend:
```powershell
cd frontend
Copy-Item .env.example .env
npm ci
npm run build
npm run dev
```
Open http://localhost:5173. Backend health: http://localhost:5000/api/health.
If you already have configured `.env` files, copy those from your original project instead of replacing them with examples. On macOS/Linux use `cp .env.example .env`.

To run the compiled backend use `npm start` inside backend. To preview the compiled frontend use `npm run preview` inside frontend (the original backend CORS configuration is for port 5173; use `npm run preview -- --port 5173` for the same origin).

## Design translation
All three references represent landing-page sections, rather than separate dashboard screens. Their shared language is applied across the existing nine-page application: ivory canvas, white surfaces, warm beige dividers, orange actions, near-black headings, muted brown secondary text, green evidence labels, and restrained shadows. Primary orange is slightly deeper for readable white button labels. The existing AI Career Coach identity is retained.

The landing page follows the split editorial hero and portfolio preview, joined three-column walkthrough, and split evidence/code panel. The preview is explicitly illustrative; functional pages continue using the original API client. Every original landing navigation action remains available. The dashboard, repositories, jobs, skill gaps, history, pricing and account pages keep their existing information architecture and controls. The application used top navigation, not a sidebar; top navigation is preserved, with a collapsible menu below desktop widths. Marketing anchor navigation is added on the landing page.

Tokens live in `frontend/tailwind.config.js` and `frontend/src/index.css`: warm slate/brand ramps; 8/12/16px card radii; subtle surface shadows; readable small text; shared form sizing and focus treatment; 160ms interactions. The landing layout stacks below 768px, navigation collapses below 1280px, and dense panels retain existing responsive grids. The existing dark-mode control remains, with a warm dark palette. CSS motion and JavaScript chart animations respect reduced-motion preferences.

## Changed files
- `frontend/tailwind.config.js`: color, typography, radii and shadow tokens.
- `frontend/src/index.css`: shared design system, reference landing layout, responsive rules, focus states and reduced motion.
- `frontend/index.html`: canvas and favicon colors.
- `frontend/src/App.tsx`: themed shell, skip link, page styling hooks, scroll-to-top on navigation. All page switch cases remain.
- `frontend/src/pages/LandingPage.tsx`: reference-led marketing layout, preserving all existing destination actions.
- All other eight files in `frontend/src/pages/`: brand accents and/or chart styling, form/modal presentation and mobile sizing. No page data-fetching functions or business handlers removed.
- `frontend/src/components/Navbar.tsx`: simpler brand treatment, landing anchors, retained app/account/theme controls and mobile menu labels.
- `frontend/src/components/DisclaimerBanner.tsx`: subdued warm demo notice; dismissal retained.
- `frontend/src/components/ToastContainer.tsx`: themed info state, screen-reader status announcements, mobile insets and bounded scrollable notification stack.
- New `frontend/src/components/IdentityImage.tsx`: original avatars/company logos with initials fallback if remote hosts fail; used in navigation, profile and jobs.
- New `frontend/src/hooks/useReducedMotion.ts`: accessibility preference for Recharts transitions.
- Footer receives the shared theme through existing Tailwind tokens; its source and links remain unchanged.
- This file and the README handoff note document the deliverable.

## Verification actually executed
- Frontend `npm run build`: passed TypeScript project build and Vite production bundle.
- Backend `npm run build`: passed TypeScript compilation.
- Byte comparisons against the supplied ZIP: all backend source files, frontend API client, AuthContext, domain types, package manifests, lockfiles and environment examples unchanged.
- Headless Chromium navigation across all nine pages at 1440, 1024, 768 and 375 pixels. No document-level horizontal overflow after correcting the mobile role selector and radar labels. Invoice table retains its own horizontal scrolling on narrow screens.
- Demo sign-in form, registration form, logout and one-click demo login passed.
- Dashboard reassessment and history reassessment passed.
- Repository modal connect, deep scan and empty search filter passed.
- Job details modal, simulated application and no-match job search passed.
- Skill priority filtering passed; chart rendered 12 bar rectangles; history line path rendered.
- Annual billing switch, simulated checkout, profile save and cancellation passed.
- Successful 200/201 API responses observed for authentication, repositories, scans, jobs, assessments, plans, checkout, invoices, profile and cancellation. These are the original simulated backend endpoints, not newly added static substitutes.
- Browser console check: external Google Fonts and Unsplash requests failed with ERR_EMPTY_RESPONSE in the restricted test environment. No application JavaScript errors were observed; system fonts and the new initials fallback keep the interface usable.
- Dark-mode switch and collapsed mobile navigation passed. No uncaught JavaScript page errors during the navigation and interaction runs.
- Screenshots visually inspected for landing, dashboard, authentication, repository, job, skills, history, pricing, profile and narrow layouts. Test screenshots are internal verification artifacts and are not included in this ZIP.

## Existing limitations and unverified features
The original app is a demonstration. Authentication accepts simulated credentials; GitHub parsing/webhooks, AI analysis, job feeds and billing are mocked or simulated. Live OAuth, external GitHub fetching, real AI evaluation, live applications and real payments are not implemented or verified by this redesign. No such capability has been added or claimed.

The original dashboard contains hard-coded demo aggregates and chart history; it can diverge from changes made elsewhere. Existing client fallback data remains unchanged. Registration passes a demo password from the API client rather than persisting a real account password. State is held in memory and is not a production database. The existing PDF receipt action only shows a demo notification; it does not download an actual receipt. These behaviors were preserved rather than rewritten.

Tests ran in Chromium, not Safari/Firefox or physical mobile devices. A full screen-reader/accessibility audit and production deployment were not performed. Remote fonts/images depend on network access; image failures now show initials. The build succeeds with Vite's warning about a JavaScript chunk above 500 kB; dependency splitting is outside this UI-only change.

## Archive contents
Complete frontend/backend source, original dependency manifests and lockfiles, environment examples, and documentation. Generated dist files, node_modules, TypeScript build caches and private .env files are excluded. Run npm ci and the build commands above to recreate platform-correct dependencies and outputs. Original configuration code and environment variable names are unchanged.
