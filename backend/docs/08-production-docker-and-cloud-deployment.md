# 08. Production Docker & Cloud Deployment: Containerizing the Backend
## The Core Backend Engineer's Masterclass: Dockerfile Anatomy & Render Container Runtimes

> **Instructor's Note:** Developing a Python application on your laptop is only half the battle. In production, your code runs inside a Linux container orchestrated by cloud platforms like Render or AWS ECS.
> 
> In this guide, you will master our **Multi-Stage Dockerfile**, understand how Linux container permissions work, learn how to handle dynamic port binding on Render, and build a production readiness probe.

---

## 1. The Multi-Stage Dockerfile Blueprint

A bad Dockerfile takes 10 minutes to build and results in a bloated 1.5GB image containing gcc, make, and git.
Our production Dockerfile uses **multi-stage compilation** to strip away compilers and produce an ultra-lean runtime container under **120MB**:

```dockerfile
# ===================================================================
# STAGE 1: The Builder Stage
# Purpose: Compiles C-extensions (like uvloop) in an isolated environment
# ===================================================================
FROM python:3.11-slim AS builder

WORKDIR /app

# Install native OS build dependencies needed by gcc
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment and install frozen dependencies
COPY requirements.txt .
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# ===================================================================
# STAGE 2: The Production Runner Stage
# Purpose: Clean, minimal runtime image without compilers
# ===================================================================
FROM python:3.11-slim AS runner

WORKDIR /app

# Copy ONLY the compiled virtual environment from builder stage
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set Python container optimization flags
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Copy application source code
COPY . .

# SECURITY: Create and switch to an unprivileged non-root user!
# If an attacker compromises a dependency, they cannot modify system files.
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Readiness Probe: Ping application every 30 seconds
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

EXPOSE 8000

# STARTUP: Dynamically bind to Render's injected $PORT variable
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

---

## 2. Dynamic Port Binding on Render Explained

### The Problem:
On your laptop, you run `uvicorn app.main:app --port 8000`. 
Render, however, runs inside a multi-tenant Linux cluster. To prevent port collisions on host machines, Render dynamically assigns an ephemeral port number (often `10000`) and passes it into the container via the environment variable `$PORT`.

### The Fix:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```
If `$PORT` exists in the container environment (Render production), Uvicorn binds to `10000`. If it does not exist (local workstation), it binds to `8000`.

---

## 3. The Health Check Probe (`backend/app/main.py`)

Cloud orchestrators need to know when your container has finished booting before routing real customer traffic to it:

```python
# backend/app/main.py
@app.get("/health", tags=["System"])
async def health_check():
    """
    Readiness Probe:
    1. Verifies Uvicorn event loop is responsive.
    2. Sends a low-overhead ping command to MongoDB Atlas replica set.
    """
    try:
        # MongoDB admin ping command takes <2ms
        await db_manager.client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "version": "2.4.0",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        # If database connection dropped, return HTTP 503!
        return JSONResponse(
            status_code=503, 
            content={"status": "degraded", "error": str(e)}
        )
```
During rolling zero-downtime deployments, Render keeps the old container alive until the new container's `/health` probe returns `200 OK`.
