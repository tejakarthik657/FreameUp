# 02. Pydantic v2 & Data Contracts: The Rust-Powered Validation Core
## The Core Backend Engineer's Masterclass: Validating & Serializing Payloads

> **Instructor's Note:** In Express or vanilla Flask, you have to write manual `if (!req.body.name)` checks or install third-party libraries like Joi/Zod. 
> 
> In FastAPI, **Pydantic v2 is your validation superpower**. Implemented in Rust, Pydantic v2 parses, validates, and serializes millions of JSON fields per second. In this guide, you will master `BaseModel`, `Field`, custom regex validators, and `BaseSettings`.

---

## 1. Why Pydantic v2 is a Game Changer (Rust Core)

In Pydantic v1, validation was written in pure Python. While flexible, parsing heavy JSON payloads (like 1,000 inventory items) consumed noticeable CPU cycles.

In Pydantic v2 (shipped in our project):
- The entire validation and serialization engine was rewritten from scratch in **Rust** (`pydantic-core`).
- **Performance:** **5x to 20x faster** than Pydantic v1.
- Direct JSON parsing directly from C-strings into memory without intermediate Python dictionary overhead.

---

## 2. Defining Request Contracts with `BaseModel` & `Field`

Let's look at `backend/app/models/business.py`:

```python
# backend/app/models/business.py
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List

class AddressModel(BaseModel):
    line1: str = Field(..., min_length=3, description="Shop address street / shop number")
    city: str = Field(..., min_length=2)
    state: str = Field(..., min_length=2)
    pincode: str = Field(..., pattern=r"^[1-9][0-9]{5}$", description="Indian 6-digit postal PIN code")

class BusinessCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Trading brand name")
    category: str = Field(..., pattern="^(restaurant|salon|services)$")
    phone: str = Field(..., pattern=r"^\+91[6-9]\d{9}$", description="E.164 Indian mobile number")
    email: EmailStr
    gstin: Optional[str] = Field(None, pattern=r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")
    address: AddressModel

    # CUSTOM FIELD VALIDATOR: Normalize business names
    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        cleaned = " ".join(value.strip().split()) # Normalize internal whitespace
        if len(cleaned) < 2:
            raise ValueError("Business name cannot be blank or whitespace.")
        return cleaned.title() # Convert to Title Case (e.g. "sharma sweets" -> "Sharma Sweets")
```

### What Happens When a Request Arrives?
If an attacker sends `{"pincode": "012345"}`:
- Pydantic's regex `^[1-9][0-9]{5}$` rejects it instantly because Indian PIN codes never start with zero.
- FastAPI automatically halts execution and emits an **HTTP 422 Unprocessable Entity** with an exact error pointer (`body.address.pincode`).
- **Your database and business logic are completely protected from dirty data.**

---

## 3. Response Models: Data Hiding & Security

One of the biggest security vulnerabilities in junior backend code is **leaking sensitive database fields** (like password hashes or internal tenant keys) back to the browser:

```python
# BAD CODE: Returns raw MongoDB document directly to client!
@app.get("/users/me")
async def get_me(user_id: str = Depends(get_current_user_id)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    return user # LEAKS hashed_password to client browser!
```

### The Production Fix: `response_model`
```python
# backend/app/models/user.py
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    is_verified: bool
    # hashed_password is NOT defined here!

# In router:
@app.get("/users/me", response_model=UserResponse)
async def get_me(user_id: str = Depends(get_current_user_id)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    user["id"] = str(user["_id"])
    return user # Pydantic automatically filters out hashed_password!
```

---

## 4. Environment Configuration with `BaseSettings`

In `backend/app/config.py`, we use Pydantic’s settings management to read environment variables:

```python
# backend/app/config.py
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # Required in production: Startup crashes if missing!
    MONGODB_URI: str = Field(..., description="MongoDB Atlas connection string")
    DATABASE_NAME: str = Field("devframes", description="Database identifier")
    JWT_SECRET: str = Field(..., min_length=32, description="256-bit entropy secret key")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_DAYS: int = 7
    GROQ_API_KEY: str = Field(..., description="Groq Cloud LPU API Key")
    PORT: int = Field(8000, description="Dynamic container host port")

    class Config:
        env_file = ".env"
        extra = "ignore" # Ignore extra unmapped variables

settings = Settings()
```

### Why This is Superior to `os.getenv("JWT_SECRET")`:
If a junior engineer deploys to Render and forgets to set `JWT_SECRET`, `os.getenv()` returns `None`. The server boots up silently, and then crashes the first time a user tries to log in.
With Pydantic `BaseSettings`, **the container fails to boot during build time** with a clear error: `Field required: JWT_SECRET`. You catch the misconfiguration before any user is affected!
