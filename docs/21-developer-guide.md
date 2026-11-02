# 21. Developer Guide: Setting Up FrameUp from Scratch

> **The Mentor's Note:** If an onboarding engineer takes 3 days to get a local development environment running, your developer ergonomics are broken. A great codebase should be fully cloned, built, and running locally in **under 10 minutes**.
> 
> In this guide, you will learn how to bootstrap FrameUp locally on your workstation, configure your environment variables, and test multi-tenant wildcard subdomains (`delhi-darbar.localhost:3000`) right on your laptop!

---

## 1. Prerequisites & Toolchain Checklist

Ensure your development machine has the following tools installed:
- **Node.js:** `v18.18.0` or higher (Recommended: `v20.x LTS`)
- **Python:** `3.11.x`
- **Package Managers:** `pnpm` (or `npm`) & `pip`
- **Git:** `2.40+`
- **Database:** A free MongoDB Atlas cluster URI, or local MongoDB Community Server `v7.0+`.

---

## 2. Step-by-Step Local Setup Runbook

### Step 1: Clone the Repository
```bash
git clone https://github.com/tejakarthik657/FreameUp.git
cd FreameUp
```

### Step 2: Configure and Start the Backend
Open a terminal in the root directory:
```bash
cd backend

# Create isolated Python virtual environment
python -m venv .venv

# Activate virtual environment:
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On macOS / Linux:
# source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/devframes?retryWrites=true&w=majority
DATABASE_NAME=devframes_local
JWT_SECRET=development_secret_key_entropy_32chars_minimum!
JWT_ALGORITHM=HS256
JWT_EXPIRES_DAYS=7
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=8000
```

Start the backend with auto-reload:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Open your browser to `http://localhost:8000/docs`. You should see the interactive Swagger UI with all 80+ endpoints!

---

### Step 3: Configure and Start the Frontend
Open a **second** terminal window:
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
Open `http://localhost:3000`. You should see the live FrameUp landing page!

---

## 3. Testing Wildcard Subdomains Locally (`/etc/hosts`)

How do you test that `sharma-sweets.frameup.in` actually rewrites to `/site/sharma-sweets` when you are developing offline on your laptop?

### The Local DNS Hack:
We can map local subdomains to loopback IP `127.0.0.1` by editing your computer's `hosts` file:
- **Windows:** `C:\Windows\System32\drivers\etc\hosts` (Open Notepad as Administrator)
- **macOS / Linux:** `sudo nano /etc/hosts`

Add these two lines at the bottom:
```
127.0.0.1   sharma-sweets.localhost
127.0.0.1   aura-salon.localhost
```

Save the file.
Now open your browser and navigate to:
`http://sharma-sweets.localhost:3000`

### What You Will See:
Vercel Edge Middleware intercepts the request, extracts `sharma-sweets` from `sharma-sweets.localhost`, and renders the storefront! You are now testing real edge multi-tenancy locally on your machine.

---

## 4. How to Talk About Developer Ergonomics in an Interview

### 🎤 The Interviewer's Question:
> *"How do you test edge middleware and multi-tenant subdomains in local development?"*

### 💡 Your Killer Answer:
> *"We designed our edge middleware to recognize `.localhost` as a first-class local testing domain alongside production domains.
> 
> By adding local loopback entries like `tenant-slug.localhost` into the workstation's `/etc/hosts` file, Next.js's edge middleware extracts the host header, strips `.localhost`, and executes the exact same URL rewriting path that runs on Vercel's edge nodes in production. 
> 
> This allows any engineer to develop and debug multi-tenant edge features locally with zero cloud dependencies."*
