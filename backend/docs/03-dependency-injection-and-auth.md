# 03. Dependency Injection & Dual-Auth Security: Protecting the Monolith
## The Core Backend Engineer's Masterclass: Composing Clean Security Layers

> **Instructor's Note:** In Express.js, authentication is usually handled by mounting global middleware `app.use(authMiddleware)`. But global middleware is clumsy: some routes need authentication, some are public, and some require specific roles.
> 
> In FastAPI, **Dependency Injection via `Depends()`** is the architectural backbone of security. In this guide, you will master hierarchical dependencies, role-based access control, and our bulletproof **Dual-Auth Protocol**.

---

## 1. What is Dependency Injection? (The Mental Model)

In plain English: **Dependency Injection means a route handler declares what it needs to execute, and FastAPI automatically provides it before running the handler.**

```python
# A simple dependency: provides database access
async def get_db():
    return db

# A route handler declaring its dependencies:
@app.get("/items")
async def read_items(database = Depends(get_db)):
    # 'database' is automatically injected!
    return await database.items.find().to_list(100)
```

### Why This is Incredibly Powerful:
1. **Reusability:** You write the authentication logic ONCE. Any endpoint that needs a user simply declares `user_id: str = Depends(get_current_user_id)`.
2. **Testability:** During Pytest execution, you can override any dependency (`app.dependency_overrides[get_current_user_id] = lambda: "mock_test_user_id"`) to test protected endpoints without creating real JWT tokens!

---

## 2. Line-by-Line Breakdown: The Dual-Auth Security Guard

Let's study `backend/app/routers/auth.py`:

```python
# backend/app/routers/auth.py (Production Security Implementation)

from fastapi import Request, Header, HTTPException, status, Depends
from jose import jwt, JWTError
from typing import Optional
from app.config import settings

async def get_current_user_id(
    request: Request,
    authorization: Optional[str] = Header(None)
) -> str:
    """
    Dual-Auth Dependency Guard:
    1. Checks for HTTP-Only Cookie 'devframes_token' (Browser Clients - XSS Safe).
    2. Falls back to 'Authorization: Bearer <token>' Header (Mobile / API Clients).
    """
    token = None
    
    # Priority 1: Secure HTTP-Only Cookie
    cookie_token = request.cookies.get("devframes_token")
    if cookie_token:
        token = cookie_token
        
    # Priority 2: Authorization Header Fallback
    elif authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        
    # If no token is provided in either transport:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    try:
        # Verify cryptographic signature using our 256-bit secret key
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token payload claims."
            )
        return user_id
        
    except JWTError:
        # Token has expired, been tampered with, or signed with wrong key
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session expired or token signature invalid."
        )
```

---

## 3. Hierarchical Sub-Dependencies: Role-Based Access Control (RBAC)

What if an endpoint requires not just *any* user, but specifically an `admin` or a `merchant`?
FastAPI allows dependencies to depend on other dependencies:

```python
# Sub-dependency: depends on get_current_user_id!
async def get_current_merchant_user(
    user_id: str = Depends(get_current_user_id)
) -> dict:
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
        
    if user.get("role") not in ["merchant", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access restricted to business merchant accounts."
        )
    return user

# In routers/invoices.py:
@router.post("/invoices")
async def create_invoice(
    payload: InvoiceCreateRequest,
    current_merchant: dict = Depends(get_current_merchant_user)
):
    # current_merchant is guaranteed to be an authenticated merchant!
    business_id = current_merchant["business_id"]
    ...
```

---

## 4. Password Security: Bcrypt Work Factor 12

In `backend/app/routers/auth.py`, passwords are never stored in plaintext:

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # Work factor 12: Takes ~250ms to hash.
    # Protects against GPU brute-force rainbow table attacks!
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

---

## 5. Setting Partitioned Cross-Site Cookies

When the merchant logs in at `/api/auth/login`, we inject the secure session cookie:

```python
response.set_cookie(
    key="devframes_token",
    value=token,
    httponly=True,           # JavaScript cannot read it (XSS immune)
    secure=True,             # Transmitted only over HTTPS
    samesite="none",         # Required for decoupled domains (vercel.app -> onrender.com)
    max_age=7 * 24 * 3600,   # 7 days expiration
    path="/"
)
```
