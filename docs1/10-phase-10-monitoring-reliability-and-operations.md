# Phase 10 — Monitoring, Reliability & Production Operations
## System: FrameUp (DevFrames Enterprise MSME Operating System)

> **Architect's Orientation:** This document details **production operations after deployment**. We cover structured JSON telemetry, correlation IDs, the Circuit Breaker pattern, incident post-mortem analysis (INC-2026-08A), Site Reliability Engineering (SRE) objectives, disaster recovery, and continuous maintenance.

---

## 71. Application Monitoring & Health Probes

### 71.1 Readiness & Liveness Probes
```python
# backend/app/main.py
@app.get("/health", tags=["System"])
async def health_check():
    try:
        await db.client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "version": "2.4.0",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return JSONResponse(status_code=503, content={"status": "degraded", "error": str(e)})
```

---

## 72. Logging Engineering: Structured JSON Protocol
Every log event emitted by the FastAPI container is serialized as a single-line JSON string:

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

## 73. Distributed Tracing & Correlation IDs
- Incoming requests receive an `X-Request-ID` header at the edge.
- The FastAPI middleware extracts or assigns this correlation ID and passes it to every log event and downstream Groq LPU API call, allowing engineers to trace a user's transaction across multiple systems.

---

## 74. Metrics & Observability (The Four Golden Signals)
1. **Latency:** Storefront edge TTFB $\le 180\text{ms}$; API CRUD p95 $\le 75\text{ms}$.
2. **Traffic:** Monitored via Vercel Edge Analytics and Uvicorn request meters.
3. **Errors:** Error rate target: $< 0.1\%$ of total HTTP requests.
4. **Saturation:** Container memory capped at $< 300\text{MB}$ (leaving 212MB safety headroom on 512MB instances).

---

## 75. Error & Incident Management: Post-Mortem INC-2026-08A

```
+-----------------------------------------------------------------------------------+
|                        INCIDENT POST-MORTEM: INC-2026-08A                         |
+----------------------+------------------------------------------------------------+
| Incident ID          | INC-2026-08A                                               |
| Severity             | P1 - Critical Outage (Frontend Unable to Authenticate)     |
| Duration             | 32 minutes                                                 |
| Root Cause           | Unhandled startup exception caused Starlette to return 500 |
|                      | bypassing CORSMiddleware, stripping Access-Control headers.|
| Action Taken         | Added dynamic $PORT binding + CORS-preserving 500 handler. |
+----------------------+------------------------------------------------------------+
```

---

## 76. Reliability Engineering (SRE) & Circuit Breakers

### 76.1 Circuit Breaker Implementation
```python
# backend/app/services/circuit_breaker.py
class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 30.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = 0.0
        self.state = "CLOSED" # CLOSED, OPEN, HALF-OPEN

    async def call(self, func, *args, **kwargs):
        now = time.time()
        if self.state == "OPEN":
            if now - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF-OPEN"
            else:
                raise Exception("Circuit breaker is OPEN. Upstream unavailable.")
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

## 77. Disaster Recovery: RPO & RTO
- **Recovery Point Objective (RPO):** $< 5\text{ minutes}$. Continuous automated oplog backups on MongoDB Atlas.
- **Recovery Time Objective (RTO):** $< 3\text{ minutes}$. Automated replica set failover promotes a secondary node to primary in $< 3\text{ seconds}$.

---

## 78. Production Optimization & Capacity Planning
- Shifting poster generation from server-side Puppeteer to browser HTML5 Canvas dropped backend server compute by **100%**, scaling to arbitrary concurrency at $0 cost increase.
- Groq LPU caching and prompt compaction reduces AI extraction token bills by **92%**.

---

## 79. Release & Rollback Management
- Deployments use rolling zero-downtime container replacement.
- If `/health` fails during deployment, Render cancels rollout and keeps the previous container running.

---

## 80. Maintenance Engineering & Technical Debt
- Weekly automated dependency scans via Dependabot.
- Monthly index execution review (`executionStats`) ensuring zero unindexed queries creep into production.
