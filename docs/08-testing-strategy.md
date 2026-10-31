# 08. Testing Strategy & Verification Pipeline

## Document Information
- **Test Frameworks:** `pytest`, `pytest-asyncio`, `httpx` (Backend) / `Jest`, `Playwright` (Frontend)
- **Coverage Target:** > 80% line coverage across critical security & financial routes
- **Test Execution Environment:** Isolated In-Memory MongoDB & Mocked Groq LPU Stubs

---

## 13. Testing Strategy & Quality Assurance

### 13.1 The Testing Pyramid
```
            / \
           / E2E \       <- Playwright Subdomain & Workflow Tests
          /-------\
         / Integr- \     <- FastAPI TestClient + Async MongoDB Tests
        /  ation    \
       /-------------\
      /   Unit Tests  \   <- Pure Functions: Verhoeff, GST Math, Column Matching
     /-----------------\
```

---

### 13.2 Unit Testing: Mathematical Checksums & Tax Logic

#### 1. Verhoeff Dihedral Group Checksum Test Suite
```python
# backend/tests/test_verhoeff.py
import pytest
from app.routers.dpdp_gateway import validate_verhoeff

def test_valid_verhoeff_aadhaar():
    # Valid Aadhaar numbers generated according to UIDAI specification
    assert validate_verhoeff("234567890120") is True
    assert validate_verhoeff("345678901238") is True

def test_single_digit_transcription_error():
    # Mutating a single digit (0 -> 1)
    assert validate_verhoeff("234567890121") is False

def test_adjacent_transposition_error():
    # Transposing adjacent digits (01 -> 10)
    assert validate_verhoeff("234567891020") is False

def test_invalid_characters():
    assert validate_verhoeff("23456789012A") is False
    assert validate_verhoeff("") is False
    assert validate_verhoeff("123") is False
```

#### 2. GST Multi-Tier Tax Calculation Test Suite
```python
# backend/tests/test_invoices.py
from app.routers.invoices import calculate_gst_breakdown

def test_gst_intra_state_calculation():
    items = [
        {"qty": 2, "unit_price": 500.0, "tax_rate": 18.0}, # Subtotal = 1000, 18% = 180
        {"qty": 1, "unit_price": 200.0, "tax_rate": 5.0}   # Subtotal = 200, 5% = 10
    ]
    # Total Subtotal = 1200. Total Tax = 190 (CGST 95, SGST 95)
    result = calculate_gst_breakdown(items, is_interstate=False)
    assert result["subtotal"] == 1200.0
    assert result["cgst"] == 95.0
    assert result["sgst"] == 95.0
    assert result["igst"] == 0.0
    assert result["total"] == 1390.0

def test_gst_inter_state_calculation():
    items = [{"qty": 1, "unit_price": 1000.0, "tax_rate": 12.0}]
    result = calculate_gst_breakdown(items, is_interstate=True)
    assert result["subtotal"] == 1000.0
    assert result["cgst"] == 0.0
    assert result["sgst"] == 0.0
    assert result["igst"] == 120.0
    assert result["total"] == 1120.0
```

---

### 13.3 Integration Testing: Async API Routes with TestClient

Using `httpx.AsyncClient` to test the full ASGI pipeline without starting a physical socket listener:

```python
# backend/tests/test_auth_routes.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_auth_login_dual_transport():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Step 1: Login with valid credentials
        response = await ac.post("/api/auth/login", json={
            "email": "demo@frameup.in",
            "password": "Password123!"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "devframes_token" in response.cookies
        
        # Step 2: Access protected route with Bearer header
        headers = {"Authorization": f"Bearer {data['token']}"}
        me_response = await ac.get("/api/auth/me", headers=headers)
        assert me_response.status_code == 200
        assert me_response.json()["email"] == "demo@frameup.in"
```

---

### 13.4 Mocking External Services (Groq LPU & Cloudinary)

To guarantee deterministic, non-flaky integration tests that run offline without consuming external API credits:

```python
# backend/tests/conftest.py
import pytest
from unittest.mock import AsyncMock, patch

@pytest.fixture(autouse=True)
def mock_groq_lpu():
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

### 13.5 Continuous Integration (GitHub Actions)
Tests run automatically on every pull request targeting `main`:
```yaml
# .github/workflows/test.yml
name: Continuous Integration & Verification
on: [push, pull_request]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-asyncio httpx
      - name: Run Test Suite
        run: |
          cd backend
          pytest -v --maxfail=1
```
