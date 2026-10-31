# 11. Production Observability & Reliability Engineering

## Document Information
- **Telemetry Standard:** Structured JSON Logging + Request Correlation IDs (`X-Request-ID`)
- **Reliability Pattern:** Circuit Breaker, Exponential Backoff with Jitter, Graceful Degradation
- **Incident Post-Mortem:** INC-2026-08A (Render 500 CORS Stripping & Dynamic Port Binding)

---

## 15. Observability & Telemetry

### 15.1 Structured Logging Protocol
To support log ingestion pipelines (Datadog / BetterStack / CloudWatch), the Uvicorn ASGI application formats all application events as single-line JSON strings:

```json
{
  "timestamp": "2026-08-30T16:20:00.412Z",
  "level": "INFO",
  "correlation_id": "req_8f1a2b3c4d5e",
  "path": "/api/invoices",
  "method": "POST",
  "status_code": 201,
  "duration_ms": 42.8,
  "tenant_id": "66d1a980e1b2c3d4e5f60001",
  "message": "GST Invoice INV-2026-0042 successfully issued"
}
```

---

### 15.2 Real Incident Post-Mortem: The Render CORS & Dynamic Port Outage

#### Incident Overview
- **Incident ID:** `INC-2026-08A`
- **Severity:** P1 (Critical Outage)
- **Impact:** Frontend could not communicate with backend; users experienced generic CORS errors on login.
- **Duration:** 32 minutes

#### Root Cause Analysis (5 Whys)
1. *Why did login fail?* Browser threw `Access to fetch at 'https://freameup.onrender.com/api/auth/login' from origin 'https://devframes-presence.vercel.app' has been blocked by CORS policy`.
2. *Why was CORS blocked?* The backend container threw an unhandled exception during startup, resulting in an HTTP 500 response.
3. *Why did an HTTP 500 trigger a CORS error?* Standard Starlette/FastAPI exception handlers catch unhandled Python tracebacks and emit a bare 500 response without running through the user-defined middleware stack (`CORSMiddleware`). The browser, receiving a 500 status without `Access-Control-Allow-Origin`, suppressed the 500 payload and displayed a CORS error.
4. *Why did the startup fail in the first place?* The hardcoded startup command `uvicorn app.main:app --port 8000` failed to bind to Render's dynamically injected environment variable `$PORT` (assigned as 10000 on Linux containers).
5. *Why was this missed locally?* Local development relies on fixed port 8000 without container host port reassignment.

#### Corrective & Preventative Actions
1. **Dynamic Port Binding Fix:** Updated Render build command to evaluate `$PORT` dynamically:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
2. **CORS Preservation in Global Exception Handler:** Implemented custom exception handler ensuring that even if an unhandled 500 error is thrown, the matching `Access-Control-Allow-Origin` header is attached to the error response.
3. **Automated Health Check Alerting:** Added liveness probe (`/health`) that Render's health checker polls every 15 seconds.

---

## 16. Reliability Engineering & Fault Tolerance

### 16.1 Circuit Breaker Implementation (External AI & Vision)
When Groq Cloud or external CDNs experience transient degradation, the backend prevents cascading thread starvation by wrapping calls in a lightweight circuit breaker:

```python
# backend/app/services/circuit_breaker.py
import time
from typing import Callable, Any

class CircuitBreakerOpenException(Exception):
    pass

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 30.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = 0.0
        self.state = "CLOSED" # CLOSED, OPEN, HALF-OPEN

    async def call(self, func: Callable, *args, **kwargs) -> Any:
        now = time.time()
        
        if self.state == "OPEN":
            if now - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF-OPEN"
            else:
                raise CircuitBreakerOpenException("Circuit breaker is OPEN. Upstream unavailable.")
                
        try:
            result = await func(*args, **kwargs)
            if self.state == "HALF-OPEN":
                self.state = "CLOSED"
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = now
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
            raise e
```

---

### 16.2 Exponential Backoff with Full Jitter
To mitigate the "thundering herd" problem when retrying failed external HTTP requests:

$$\text{sleep} = \text{random}(0, \min(M, B \times 2^{\text{attempt}}))$$

Where $B$ is the base delay ($500\text{ms}$) and $M$ is the maximum backoff limit ($5,000\text{ms}$).

---

### 16.3 Graceful Degradation Hierarchy

| Tier | Failure Scenario | Degradation Behavior |
| :--- | :--- | :--- |
| **Tier 1 (Normal)** | All systems operational | Real-time Groq LPU schema extraction + dynamic preview. |
| **Tier 2 (AI Degraded)** | Groq API rate limited / unreachable | Fallback to deterministic regex CSV/Excel column parser; user manually reviews mappings. |
| **Tier 3 (DB Read Only)** | MongoDB replica set undergoing election | Edge SSR serves cached storefront pages from ISR edge cache; write actions queue in localStorage. |
