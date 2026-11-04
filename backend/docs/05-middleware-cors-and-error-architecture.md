# 05. Middleware, CORS & Error Architecture: Bulletproofing the Transport
## The Core Backend Engineer's Masterclass: Cross-Origin Protocols & Exception Handling

> **Instructor's Note:** The majority of production outages in decoupled frontend-backend architectures are not caused by complex business logic—they are caused by **misconfigured CORS headers and unhandled exceptions that break the HTTP pipeline**.
> 
> In this guide, you will master Starlette middleware execution ordering, dynamic regex-based origin matching for multi-tenant subdomains, and how to write a custom global exception handler that never masks a 500 crash as a CORS error.

---

## 1. Middleware Ordering in Starlette / FastAPI

In ASGI frameworks, middleware wraps around the application like an onion:

```
[ Incoming HTTP Request ]
           |
           v
+-----------------------------------------------------------+
| 1. RequestTimingMiddleware (Logs duration & correlation)  |
|      |
|      v
| 2. CORSMiddleware (Evaluates Origin header vs Regex)      |
|      |
|      v
| 3. Global Exception Handler (Catches unhandled Python)    |
|      |
|      v
| 4. Security Guards (Dual-Auth JWT Verification)           |
|      |
|      v
| 5. Router Controller (e.g. /api/invoices)                 |
+-----------------------------------------------------------+
           |
[ Outgoing HTTP Response ]
```

### The Inviolable Rule of Middleware:
The **last middleware added** in code is the **first middleware to execute** on an incoming request!

---

## 2. Dynamic CORS Regex for Multi-Tenant Wildcards

In local development, your frontend runs on `http://localhost:3000`. 
In staging, Vercel creates preview URLs like `https://devframes-presence-abc123-preview.vercel.app`. 
In production, users browse on `https://frameup.in` or custom subdomains like `https://sharma-sweets.frameup.in`.

If you use a hardcoded whitelist (`allow_origins=["https://frameup.in"]`), every preview deployment and subdomain will be blocked by CORS!

### Our Solution: Regex Origin Matching
```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    # Regex matches: Any Vercel preview domain, frameup.in, and local development
    allow_origin_regex=r"https://.*\.vercel\.app$|https://frameup\.in$|http://localhost:3000$",
    allow_credentials=True, # MANDATORY for sending Set-Cookie headers across domains!
    allow_methods=["*"],    # Allow GET, POST, PUT, PATCH, DELETE, OPTIONS
    allow_headers=["*"],    # Allow Authorization, Content-Type, X-Request-ID
)
```

---

## 3. The 500 Error CORS Stripping Defect (And the Fix)

### The Production Nightmare:
When an unhandled exception occurs in Python (e.g. `KeyError: 'business_id'`), Starlette's internal error handler catches the traceback and returns an empty HTTP 500 error page.
Because the exception aborted the inner pipeline, **`CORSMiddleware` does not execute on the response!**
The response arrives at the browser **without** `Access-Control-Allow-Origin`.
The browser console throws:
`Access to fetch has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

A developer looks at that and spends 4 hours tweaking CORS settings, when the real problem was a missing dictionary key in Python!

### The Production Fix: Custom Global Exception Handler
```python
# backend/app/main.py
import re
from fastapi import Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("frameup.errors")

ALLOWED_ORIGIN_REGEX = re.compile(r"https://.*\.vercel\.app$|https://frameup\.in$|http://localhost:3000$")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin")
    
    # 1. Log the full Python traceback on our backend console
    logger.error(f"💥 UNHANDLED EXCEPTION on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    
    # 2. Build structured error response
    response = JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred.",
            "error": str(exc),
            "type": exc.__class__.__name__
        }
    )
    
    # 3. FORCE CORS HEADERS ONTO THE 500 ERROR RESPONSE!
    if origin and ALLOWED_ORIGIN_REGEX.match(origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        
    return response
```
With this handler in place, developers see the exact Python exception in their browser network tab, allowing bugs to be fixed in minutes.

---

## 4. Request Correlation IDs & Timing Middleware

```python
import time
import uuid

@app.middleware("http")
async def add_correlation_and_timing(request: Request, call_next):
    start_time = time.time()
    
    # Extract or generate unique Request ID
    correlation_id = request.headers.get("X-Request-ID", f"req_{uuid.uuid4().hex[:12]}")
    request.state.correlation_id = correlation_id
    
    response = await call_next(request)
    
    process_time_ms = round((time.time() - start_time) * 1000, 2)
    response.headers["X-Request-ID"] = correlation_id
    response.headers["X-Response-Time"] = f"{process_time_ms}ms"
    
    return response
```
