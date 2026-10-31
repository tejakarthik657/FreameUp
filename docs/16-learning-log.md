# 16. Engineering Workflow, Developer Handbook & Learning Log

## Document Information
- **Document Type:** Developer Onboarding, Operational Runbook & Engineering Retrospective
- **Target Audience:** Contributing Engineers, Technical Leads & System Maintainers
- **System Version:** `2.4.0-production`

---

## 20. Developer Onboarding & Local Development Setup

### 20.1 Prerequisites & Local Toolchain
To develop, test, and deploy FrameUp locally, ensure your environment meets the following baseline requirements:
- **Node.js:** `v18.18.0` or higher (Recommended: Node `v20.x LTS`)
- **Python:** `3.11.x`
- **Package Managers:** `pnpm` (or `npm`) & `pip`
- **Database:** MongoDB Atlas account or local MongoDB Community Server `v7.0+`
- **Git:** `2.40+`

---

### 20.2 Step-by-Step Environment Bootstrapping

#### 1. Clone Repository & Initialize Submodules
```bash
git clone https://github.com/tejakarthik657/FreameUp.git
cd FreameUp
```

#### 2. Configure Backend Environment
```bash
cd backend
python -m venv .venv

# On Linux / macOS:
source .venv/bin/activate
# On Windows (PowerShell):
# .venv\Scripts\Activate.ps1

pip install --upgrade pip
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/devframes?retryWrites=true&w=majority
DATABASE_NAME=devframes_dev
JWT_SECRET=super_secret_development_entropy_key_change_in_production_32chars!
JWT_ALGORITHM=HS256
JWT_EXPIRES_DAYS=7
GROQ_API_KEY=gsk_your_groq_lpu_api_key_here
PORT=8000
```

Start the backend development server with auto-reload:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The interactive OpenAPI/Swagger documentation is immediately accessible at:
`http://localhost:8000/docs`

#### 3. Configure Frontend Environment
In a separate terminal:
```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Start the Next.js development server:
```bash
npm run dev
```
The application is accessible at `http://localhost:3000`.

---

### 20.3 Local Subdomain Testing via `/etc/hosts`
To test wildcard subdomains (`http://delhi-darbar.localhost:3000`) locally on your development machine, add the following entry to your operating system's hosts file:
- **Windows:** `C:\Windows\System32\drivers\etc\hosts`
- **macOS / Linux:** `/etc/hosts`

```
127.0.0.1   delhi-darbar.localhost
127.0.0.1   aura-salon.localhost
```

---

## 21. Engineering Workflow & Git Governance

### 21.1 Branching Strategy
- `main`: Production-ready, deployed continuously to Vercel and Render.
- `staging`: Integration branch for pre-release validation.
- `feature/<ticket-id>-<slug>`: Feature branches created from `staging` and merged via Pull Request.

### 21.2 Conventional Commit Standards
All commits must follow the Conventional Commits specification:
- `feat(auth)`: Add Google OAuth2 callback endpoint
- `fix(cors)`: Append CORS headers on unhandled 500 exceptions
- `perf(posters)`: Shift poster rasterization to browser canvas
- `sec(dpdp)`: Implement Verhoeff Dihedral checksum for Aadhaar validation
- `docs(api)`: Complete REST endpoint documentation directory

---

## 24. Learning Log & Technical Retrospective

### 24.1 Key Architectural Insights Gained
1. **The Cost of Abstraction:** Relying on serverless functions for long-lived AI streaming or heavy data ingestion introduces cold starts and timeout risks. A lean ASGI container running on uvloop delivers 10x predictable performance at zero idle cost.
2. **First-Principles Compute Efficiency:** Shifting graphic generation from server-side headless browsers to pure client-side CSS and HTML5 Canvas completely eradicated a class of critical out-of-memory production crashes. Compute at the edge is not just a buzzword; it is a financial survival strategy for SaaS platforms.
3. **Regulatory Compliance as a Product Wedge:** Rather than treating privacy acts (like the DPDP Act 2023) as an afterthought or a legal compliance chore, building an automated cryptographic consent gateway transformed compliance into a core differentiator that wins merchant trust over legacy platforms.
4. **Resilience over Optimism:** In cross-origin distributed architectures, network packets will fail, cookies will be blocked by aggressive browser heuristics, and containers will restart on different ports. Designing dual-auth fallbacks and CORS-preserving error handlers ensures that systems fail gracefully and transparently.

### 24.2 Engineering Self-Assessment
Building FrameUp from design to edge deployment deepened practical mastery across:
- Asynchronous high-concurrency systems design in Python and TypeScript.
- Group theory and applied cryptography (Verhoeff Dihedral Group $D_5$, SHA-256 consent signing).
- Low-latency inference architectures using Groq Language Processing Units.
- Cross-origin HTTP protocols, modern cookie partitioning, and reverse-proxy routing mechanics.
- Production containerization, continuous deployment pipelines, and zero-downtime reliability engineering.
