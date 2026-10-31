# 21. Developer Guide & Local Environment Setup Runbook

## 21. Developer Guide

### 21.1 Prerequisites & System Toolchain
Ensure the following tools are installed on your workstation:
- **Node.js:** `v18.18.0` or higher (Recommended: Node `v20.x LTS`)
- **Python:** `3.11.x`
- **Package Managers:** `pnpm` (or `npm`) & `pip`
- **Database:** MongoDB Atlas account or local MongoDB Community Server `v7.0+`
- **Git:** `2.40+`

---

### 21.2 Step-by-Step Environment Bootstrapping

#### 1. Clone Repository
```bash
git clone https://github.com/tejakarthik657/FreameUp.git
cd FreameUp
```

#### 2. Backend Environment Configuration
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

Create a `.env` file inside `backend/`:
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
Interactive OpenAPI/Swagger documentation is available at: `http://localhost:8000/docs`

#### 3. Frontend Environment Configuration
In a separate terminal window:
```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Start the Next.js development server:
```bash
npm run dev
```
The application is accessible at: `http://localhost:3000`

---

### 21.3 Local Subdomain Testing via `/etc/hosts`
To test multi-tenant wildcard subdomains (`http://delhi-darbar.localhost:3000`) locally, add the following entry to your system's hosts file:
- **Windows:** `C:\Windows\System32\drivers\etc\hosts`
- **macOS / Linux:** `/etc/hosts`

```
127.0.0.1   delhi-darbar.localhost
127.0.0.1   aura-salon.localhost
```
Navigating to `http://delhi-darbar.localhost:3000` will trigger the edge middleware to resolve the `delhi-darbar` slug and render the matching storefront.
