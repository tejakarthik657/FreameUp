# 15. Production Observability & Incident Postmortems: Seeing in the Dark

> **The Mentor's Note:** When your application goes down at 2:00 AM on a Friday, plain text logs like `print("user logged in")` are useless. You need structured telemetry, correlation IDs, and an engineering culture that treats incidents not as failures, but as opportunities to eliminate entire classes of bugs.
> 
> In this guide, you will master our **Structured JSON Telemetry standard** and read the **full 5 Whys Root Cause Analysis of Incident INC-2026-08A**—the real production outage that taught us how Starlette's error handler interacts with CORS.

---

## 1. Structured JSON Logging with Request Correlation IDs

In FrameUp, we never use unformatted `print()` statements. Every log is emitted as a single-line, parseable JSON object:

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

### Why Correlation IDs (`X-Request-ID`) are Essential:
When a merchant clicks "Upload Menu", that action involves:
1. File upload to FastAPI
2. In-flight tokenization in the PII vault
3. Network request to Groq LPU
4. Write to MongoDB Atlas

By injecting a unique correlation ID (`req_8f1a2b3c4d5e`) in the request header, we can filter our entire log stream across 10,000 requests and trace **the exact lifecycle of that single user's request** in seconds.

---

## 2. Real Production Postmortem: Incident INC-2026-08A

This is an authentic post-mortem from our production deployment on Render. Memorize this story—it is the hallmark of an engineer who has fought real battles in production.

```
+-----------------------------------------------------------------------------------+
|                        INCIDENT POST-MORTEM: INC-2026-08A                         |
+----------------------+------------------------------------------------------------+
| Incident ID          | INC-2026-08A                                               |
| Date & Time          | 2026-08-30, 01:19 AM - 01:51 AM IST (Duration: 32 mins)    |
| Severity             | P1 - Critical Outage (Frontend Unable to Authenticate)     |
| Impact               | Users could not log in; received misleading CORS errors.   |
| Root Cause           | Unhandled startup exception caused Starlette to return 500 |
|                      | bypassing CORSMiddleware, stripping Access-Control headers.|
+----------------------+------------------------------------------------------------+
```

### The 5 Whys Root Cause Analysis:
1. **Why did the frontend fail to log in?**
   The browser blocked the fetch request with: `No 'Access-Control-Allow-Origin' header is present on the requested resource.`
2. **Why was the CORS header missing?**
   The backend returned an HTTP 500 error instead of a normal response. In FastAPI, unhandled exceptions bypass the middleware stack and are handled by the default Starlette error handler, which emits a bare 500 response without CORS headers.
3. **Why did the backend return an HTTP 500 in the first place?**
   The Uvicorn process failed to bind to the network socket.
4. **Why did socket binding fail?**
   The startup command in `render.yaml` hardcoded `--port 8000`, but Render dynamically allocated port `10000` via the `$PORT` environment variable.
5. **Why was this not caught in local testing?**
   Local development ran on a fixed port 8000 without host port randomization.

### Preventative Actions Taken:
1. **Startup Command Hardening:** Updated startup script to evaluate `${PORT:-8000}`.
2. **CORS Preservation in Global Exception Handler:** Added an explicit `@app.exception_handler(Exception)` that catches unhandled errors and forcefully injects `Access-Control-Allow-Origin` matching the request origin.
3. **Automated Health Check Alert:** Configured Render to poll `/health` every 15 seconds.

---

## 3. How to Talk About Incidents in an Interview

### 🎤 The Interviewer's Question:
> *"Tell me about a difficult production bug you diagnosed and fixed."*

### 💡 Your Killer Answer:
> *"One of the most deceptive bugs I encountered was an outage where our frontend reported a CORS failure upon login, but the root cause was actually a container port binding crash.
> 
> When our container deployed to Render, it failed to bind to the dynamic `$PORT` environment variable, throwing an unhandled exception. 
> 
> What made it tricky was that Starlette's default exception handler caught the traceback and emitted a bare HTTP 500 that bypassed our custom `CORSMiddleware`. The browser, seeing a 500 response lacking `Access-Control-Allow-Origin`, suppressed the 500 error details and threw a misleading CORS error in the console.
> 
> I diagnosed it by inspecting the container logs directly on Render, corrected the startup script to bind to `${PORT:-8000}`, and implemented a custom global exception handler that guarantees CORS headers are preserved even on 500 error responses so developers can always see the underlying traceback."*
