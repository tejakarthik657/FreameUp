# 10. DevOps, Containerization & Production Deployment

## Document Information
- **Cloud Providers:** Render (ASGI Backend) + Vercel (Next.js Edge) + MongoDB Atlas (Persistence)
- **Container Specification:** Dockerfile (Python 3.11 Slim ASGI)
- **CI/CD Orchestrator:** GitHub Actions (`.github/workflows/deploy.yml`)
- **Deployment Strategy:** Blue-Green / Rolling Zero-Downtime Deployments

---

## 14. DevOps, Infrastructure & Deployment Architecture

### 14.1 Distributed Production Topology
```mermaid
graph TD
    subgraph Source Control
        GitRepo[GitHub Repository: tejakarthik657/FreameUp]
    end

    subgraph CI / CD Automation
        GHAction[GitHub Actions Automated Runner]
    end

    subgraph Edge Tier
        VercelEdge[Vercel Global Edge Network]
    end

    subgraph Application Tier
        RenderContainer[Render Web Service: Uvicorn ASGI Container]
    end

    subgraph Data Tier
        AtlasCluster[MongoDB Atlas Cloud Cluster - AWS ap-south-1 Mumbai]
        CloudinaryMedia[Cloudinary Global Media CDN]
    end

    GitRepo -->|git push origin main| GHAction
    GHAction -->|Trigger Deployment Hook| VercelEdge
    GHAction -->|Trigger Deploy Hook| RenderContainer
    VercelEdge -->|Public Storefront Traffic| RenderContainer
    RenderContainer -->|Encrypted Wire Protocol TLS| AtlasCluster
    RenderContainer -->|Upload Assets| CloudinaryMedia
```

---

### 14.2 Production Dockerfile Specification

```dockerfile
# Multi-stage lightweight production container
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies in isolated virtual environment
COPY requirements.txt .
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Final runtime image
FROM python:3.11-slim AS runner

WORKDIR /app

# Copy virtual environment from builder stage
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Environment defaults
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Copy application source code
COPY . .

# Run as non-privileged user for container security
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Healthcheck probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

EXPOSE 8000

# Launch Uvicorn ASGI with single worker per free/starter dyno
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
```

---

### 14.3 Environment Variable Configuration Matrix

| Variable Name | Environment | Purpose & Secret Classification | Example Production Value |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | Backend | Connection string with auth credentials | `mongodb+srv://admin:***@cluster0.mongodb.net/devframes` |
| `DATABASE_NAME`| Backend | Target logical database identifier | `devframes_production` |
| `JWT_SECRET` | Backend | 256-bit entropy signing key for tokens | `c48f9a2b1c4e7d8e9f...` (Confidential) |
| `JWT_ALGORITHM`| Backend | Cryptographic algorithm | `HS256` |
| `JWT_EXPIRES_DAYS`| Backend | Session duration before required login | `7` |
| `GROQ_API_KEY` | Backend | API Key for Groq LPU inference cluster | `gsk_***` (Confidential) |
| `GOOGLE_CLIENT_ID`| Backend | Google OAuth2 credentials | `***.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET`| Backend | Google OAuth2 client secret | `GOCSPX-***` (Confidential) |
| `NEXT_PUBLIC_API_URL`| Frontend | Origin API endpoint for browser calls | `https://freameup.onrender.com` |
| `NEXT_PUBLIC_APP_URL`| Frontend | Canonical web app URL for redirects | `https://frameup.in` |

---

### 14.4 Health Check & Readiness Probes

To enable Render and Vercel load balancers to detect stalled processes or dropped database connections:

```python
# backend/app/main.py
@app.get("/health", tags=["System"])
async def health_check():
    """
    Readiness & Liveness probe. Verifies event loop responsiveness
    and ping-tests the MongoDB Atlas replica set connection.
    """
    try:
        # Perform low-overhead database ping
        await db.client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "version": "2.4.0",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "degraded", "error": str(e)}
        )
```

---

### 14.5 Continuous Deployment (GitHub Actions)

```yaml
name: Production Deployment Pipeline
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy Hook
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
      
      - name: Verify Health Endpoint
        run: |
          sleep 45
          curl -f https://freameup.onrender.com/health || exit 1
```
