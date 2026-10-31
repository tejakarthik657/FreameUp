# 16. Reliability Engineering & Fault Tolerance

## 16. Reliability Engineering

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
