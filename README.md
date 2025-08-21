# my-v0-project
A B2C Nutrition app with Appwrite authentication and modern React/Next.js frontend.
## Tech Stack
- **Framework**: Next.js (React)  
- **Auth**: Appwrite Web SDK (client-side)  
- **Language**: TypeScript/JavaScript  
- **Package Manager**: pnpm  
- **Node**: >=18 (recommended 20)
## Features
- Appwrite-based authentication (sign up, login, session handling)
- Modern B2C nutrition UI components
- Environment-driven configuration via `.env.local`
## Project Structure (top levels)
```
./
$null
.env.appwrite.local
.env.local
.gitignore
app/
  _mock/
  admin/
  api/
  create/
  favorites/
  forgot-password/
  globals.css
  history/
  layout.tsx
  login/
  onboarding/
  page.tsx
  profile/
  recipe-analyzer/
  recipes/
  register/
  reset-password/
  saved/
  scan/
  search/
  settings/
  verify-email/
components/
  admin/
  analyzer/
  app-header.tsx
  app-shell.tsx
  auth-guard.tsx
  bottom-nav.tsx
  client-providers.tsx
  cuisine-multi-select.tsx
  error-boundary.tsx
  filter-panel.tsx
  health-onboarding-wizard.tsx
  left-sidebar.tsx
  nutrition-facts-panel.tsx
  profile-health.tsx
  profile-overview.tsx
  profile-security.tsx
  profile-tabs.tsx
  recipe/
  recipe-builder-simple/
  recipe-card.tsx
  recipe-hero.tsx
  recipe-tabs.tsx
  role-guard.tsx
  route-guard.tsx
  scan/
  settings/
  start-cooking-overlay.tsx
  sticky-save-bar.tsx
  theme-provider.tsx
  ui/
  unsaved-changes-prompt.tsx
components.json
hooks/
  use-barcode-scanner.ts
  use-favorites.tsx
  use-filters.tsx
  use-history.tsx
  use-mobile.ts
  use-settings.tsx
  use-toast.ts
  use-user.tsx
lib/
  admin/
  analyze.ts
  api.ts
  appwrite.ts
  barcode.ts
  data.ts
  mock-auth.ts
  nutrition.ts
  recipes.ts
  recommendation.ts
  settings.ts
  taxonomy.ts
  test-mode.ts
  types.ts
  units.ts
  utils.ts
next-env.d.ts
next.config.mjs
package-lock.json
package.json
pnpm-lock.yaml
postcss.config.mjs
public/
  chicken-alfredo-zoodles.png
  diverse-user-avatars.png
  garlic-butter-salmon-asparagus.png
  images/
  mediterranean-quinoa-salad.png
  placeholder-logo.png
  placeholder-logo.svg
  placeholder-user.jpg
  placeholder-zhhbx.png
  placeholder.jpg
  placeholder.svg
  sushi-bowl-salmon-avocado.png
  thai-basil-stir-fry.png
  vegan-buddha-bowl.png
  vegetarian-breakfast-burrito.png
scripts/
  appwrite-reset-schema.js
  appwrite-sync-schema.js
  setup-appwrite.js
styles/
  globals.css
tsconfig.json
```
## Prerequisites
- Node >=18 (recommended 20)
- pnpm installed
- An Appwrite project (self-hosted or cloud)
## Environment Variables
Create a `.env.local` at the project root. Use the template below (also see `.env.example`):

```bash
# Copy this file to .env.local and fill the values
DOTENV_CONFIG_PATH=
NEXT_PUBLIC_APPWRITE_ADMINS_TEAM_ID=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_HEALTH_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_PROJECT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APP_URL=
```
Common Appwrite variables for client-only setups:
```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
# Optional (if using databases/storage from the client)
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_BUCKET_ID=
```

> **Note:** Only expose values intended for the browser with the `NEXT_PUBLIC_` prefix.
## Local Setup

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Linting

```bash
pnpm lint
```
## Appwrite Setup (Quick Start)

1. Create a **Project** in Appwrite and note your **Project ID** and **Endpoint**.
2. In **Authentication → Providers**, enable **Email/Password** (or providers you need).
3. In **Console → API Keys**, create a key if you later add server-side functions (not needed for client-only auth).
4. If using Databases/Storage from the frontend:
   - Create a **Database** (e.g. `b2c`), a **Collection** (e.g. `users`), and a **Bucket** (e.g. `images`).
   - Add read/write rules appropriate for public client access (or proxy via a server route).
5. Fill `.env.local` with `NEXT_PUBLIC_APPWRITE_*` values and restart the dev server.
## Scripts
- **dev**: `next dev`
- **build**: `next build`
- **lint**: `next lint`

## Deployment
- Vercel/Netlify or any Node host that supports Next.js.
- Set the same environment variables in your hosting provider.
- Ensure `NODE_VERSION` is compatible (recommend 20.x).
## Contributing
1. Fork the repo & create a feature branch: `git checkout -b feat/xyz`
2. Commit with conventional messages (e.g. `feat: add nutrition card`)
3. Push & open a PR against `main`.
## GitHub Actions (CI)
This repository includes a basic CI workflow under `.github/workflows/ci.yml` to install, lint, and build on every push and PR.
## License
Choose a license (e.g. MIT) and add a `LICENSE` file.

---
*Generated on 2025-08-20T16:35:38.171194Z.*

## Detected Environment Variables

| Name | Purpose |
|---|---|
| `APPWRITE_API_KEY` | Appwrite API key with needed scopes (server; used by schema/setup scripts) |
| `APPWRITE_DB_ID` | Database ID (server) |
| `APPWRITE_ENDPOINT` | Appwrite HTTP API endpoint (server) |
| `APPWRITE_HEALTH_COLLECTION_ID` | Health profiles collection ID (server) |
| `APPWRITE_PROFILES_COLLECTION_ID` | Profiles collection ID (server) |
| `APPWRITE_PROJECT_ID` | Appwrite Project ID (server) |
| `DOTENV_CONFIG_PATH` | Internal: used by scripts to point dotenv to .env.appwrite.local |
| `NEXT_PUBLIC_APPWRITE_ADMINS_TEAM_ID` | Admins team ID to gate admin console (public) |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | Appwrite Database ID used by the app (public) |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite HTTP API endpoint (public) |
| `NEXT_PUBLIC_APPWRITE_HEALTH_COLLECTION_ID` | Health profiles collection ID (public) |
| `NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID` | Profiles collection ID (public) |
| `NEXT_PUBLIC_APPWRITE_PROJECT` | Appwrite Project (alt) (public) |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite Project ID (public) |
| `NEXT_PUBLIC_APP_URL` | Public URL of this app (used in emails/links) |
