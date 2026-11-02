# 13. Testing Strategy & Verification Pipeline: Shipping with Total Confidence

> **The Mentor's Note:** Untested software is broken software you haven't discovered yet. But writing tests just to hit an arbitrary 80% coverage badge is useless if your tests only assert that `True is True`.
> 
> In this guide, you will learn how we built our **Testing Pyramid**, see our exact unit tests for the **Verhoeff algorithm and GST tax math**, learn how we mock external AI calls without spending a single Groq token, and master how GitHub Actions automates quality verification on every commit.

---

## 1. The Testing Pyramid: Quality over Quantity

```
             / \
            / E2E \         <- Playwright: Subdomain resolution & browser canvas exports
           /-------\
          / Integr- \       <- httpx.AsyncClient: Ingress ASGI routes + Motor DB tests
         /  ation    \
        /-------------\
       /   Unit Tests  \     <- Pure functions: Verhoeff D5, GST tax math, PII masking
      /-----------------\
```

- **Unit Tests (Fast, 0 Network, 100% Deterministic):** We test our pure mathematical and algorithmic functions: Does the Verhoeff checksum catch a swapped digit? Does the GST engine split 5% intra-state taxes into 2.5% CGST and 2.5% SGST?
- **Integration Tests (Async ASGI Pipeline):** We test full HTTP routes using `httpx.AsyncClient` without spinning up physical network sockets. We verify that tokens are parsed, headers are validated, and data is saved.
- **Mocks (Deterministic External I/O):** We mock external APIs like Groq Cloud and Cloudinary so our test suite can run on an airplane with zero internet in **under 4 seconds**.

---

## 2. Unit Testing: Mathematical Invariants

### 1. Testing the Verhoeff Dihedral Group Algorithm
```python
# backend/tests/test_verhoeff.py (Production Test Suite)

import pytest
from app.routers.dpdp_gateway import validate_verhoeff

def test_valid_aadhaar_checksums():
    """Valid numbers generated according to official UIDAI D5 specification."""
    assert validate_verhoeff("234567890120") is True
    assert validate_verhoeff("345678901238") is True

def test_single_digit_transcription_error():
    """A human types a 1 instead of a 0 at the end."""
    assert validate_verhoeff("234567890121") is False

def test_adjacent_transposition_error():
    """A human accidentally swaps two adjacent numbers (01 -> 10)."""
    assert validate_verhoeff("234567891020") is False

def test_twin_error_detection():
    """Twin digits swapped."""
    assert validate_verhoeff("234567899920") is False

def test_garbage_and_alphabetic_inputs():
    """Sanity checks for malicious or malformed inputs."""
    assert validate_verhoeff("23456789012A") is False
    assert validate_verhoeff("") is False
    assert validate_verhoeff("123") is False
```

### 2. Testing GST Multi-Tier Tax Splitting
```python
# backend/tests/test_invoices.py (Production Test Suite)

from app.routers.invoices import calculate_gst_breakdown

def test_intra_state_gst_tax_split():
    """Intra-state sales must split tax 50/50 into CGST and SGST."""
    items = [
        {"qty": 2, "unit_price": 500.0, "tax_rate": 18.0}, # ₹1000 @ 18% = ₹180 tax
        {"qty": 1, "unit_price": 200.0, "tax_rate": 5.0}   # ₹200 @ 5% = ₹10 tax
    ]
    # Total Subtotal = ₹1200. Total Tax = ₹190.
    result = calculate_gst_breakdown(items, is_interstate=False)
    assert result["subtotal"] == 1200.0
    assert result["cgst"] == 95.0 # Exactly half of 190
    assert result["sgst"] == 95.0 # Exactly half of 190
    assert result["igst"] == 0.0
    assert result["total"] == 1390.0

def test_inter_state_gst_calculation():
    """Inter-state sales must allocate 100% of tax to IGST."""
    items = [{"qty": 1, "unit_price": 1000.0, "tax_rate": 12.0}]
    result = calculate_gst_breakdown(items, is_interstate=True)
    assert result["subtotal"] == 1000.0
    assert result["cgst"] == 0.0
    assert result["sgst"] == 0.0
    assert result["igst"] == 120.0
    assert result["total"] == 1120.0
```

---

## 3. Integration Testing: Full Async ASGI Pipeline

We use `httpx.AsyncClient` passing `app=app`. This directly feeds HTTP events into Uvicorn’s ASGI interface in memory, giving us lightning-fast test execution:

```python
# backend/tests/test_auth_routes.py

import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_auth_login_sets_cookie_and_bearer():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/auth/login", json={
            "email": "demo@frameup.in",
            "password": "Password123!"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify Dual-Auth contract: Token returned in JSON body AND in Set-Cookie
        assert "token" in data
        assert "devframes_token" in response.cookies
        
        # Verify that protected route succeeds with Bearer header
        headers = {"Authorization": f"Bearer {data['token']}"}
        me_resp = await ac.get("/api/auth/me", headers=headers)
        assert me_resp.status_code == 200
        assert me_resp.json()["email"] == "demo@frameup.in"
```

---

## 4. Mocking Groq LPUs for Offline Determinism

We never want our CI pipeline to fail because external Groq APIs are experiencing a rate limit or because our API key expired:

```python
# backend/tests/conftest.py
import pytest
from unittest.mock import AsyncMock, patch

@pytest.fixture(autouse=True)
def mock_groq_lpu():
    """Stubs Groq LPU API call with a deterministic JSON catalog."""
    mock_response = {
        "choices": [{
            "message": {
                "content": '{"name": "Paneer Butter Masala", "price": 280, "category": "Curries"}'
            }
        }]
    }
    with patch("app.services.groq_service.client.chat.completions.create", new_callable=AsyncMock) as mock_create:
        mock_create.return_value = mock_response
        yield mock_create
```

---

## 5. How to Defend Testing in an Interview

### 🎤 The Interviewer's Question:
> *"What is your testing philosophy, and how do you prevent flaky tests?"*

### 💡 Your Killer Answer:
> *"My philosophy is to aggressively isolate unit logic from network dependencies.
> 
> Flaky tests almost always happen when test suites depend on external networks or unseeded databases. 
> 
> In FrameUp, we strictly unit test algorithmic invariants—like the Verhoeff dihedral algorithm and multi-tier GST tax splits—as pure mathematical functions with zero side effects. 
> 
> For our integration tier, we use `httpx.AsyncClient` directly against the FastAPI ASGI app instance in memory, and stub external services like Groq LPUs using mock fixtures. 
> 
> This allows our entire test suite to run in under 5 seconds on every git push, giving us instantaneous feedback without flakiness."*
