# 12. Distributed Systems & Cross-Tier Coordination: Keeping State in Sync

> **The Mentor's Note:** Distributed systems are hard because of one brutal truth: **the network is unreliable**. Packets drop, mobile signals cut out, containers restart on different ports, and database primaries undergo leader elections.
> 
> In this guide, you will master how FrameUp balances **Strong Consistency** for money and stock with **Eventual Consistency** for public storefronts, and how our **Idempotency Engine** prevents double-billing when a cashier taps "Pay" twice on a lagging 4G connection.

---

## 1. The Distributed Topology: 3 Independent Clouds

FrameUp does not live on a single server. It spans three distinct, independent cloud infrastructures:

```
[ GLOBAL EDGE NETWORK (Vercel) ]
- 300+ Edge Points of Presence worldwide
- Runs middleware.ts & Edge SSR
- Consistency Model: Eventual Consistency (ISR 60s)
               |
               | (HTTPS REST / Dynamic CORS)
               v
[ APPLICATION CLUSTER (Render) ]
- Linux ASGI container running Uvicorn + uvloop
- Ephemeral port binding ($PORT)
- Stateless computation & AI orchestration
               |
               | (MongoDB Wire Protocol over TLS)
               v
[ MANAGED REPLICA SET (MongoDB Atlas - AWS Mumbai ap-south-1) ]
- Primary-Secondary-Secondary (PSS) 3-Node Architecture
- Consistency Model: Strong Consistency (Write Concern: majority)
- Raft-based automated failover in < 3 seconds
```

---

## 2. Strong Consistency vs Eventual Consistency: Where We Draw the Line

In a distributed system, you cannot have everything strongly consistent everywhere without introducing crippling latency. We made an intentional architectural division:

### 1. Strong Consistency (The Financial & Stock Domain):
- When an invoice is created, or inventory is deducted:
  - We use MongoDB's **`w: "majority"` write concern**.
  - The primary node waits until a majority of replica set nodes have written the transaction to their write-ahead log (`oplog`) before returning success.
  - **Guarantee:** If the primary node physically catches fire 1 millisecond later, the new primary elected by the replica set is guaranteed to have the invoice record. Zero financial data loss.

### 2. Eventual Consistency (The Public Storefront Domain):
- When Rajesh in Lucknow updates the price of Gulab Jamun from ₹40 to ₹50:
  - The database is updated immediately with strong consistency.
  - But the Vercel Edge CDN continues serving the cached HTML page for up to **60 seconds** (`revalidate: 60`).
  - The next customer who visits triggers a background stale-while-revalidate update, refreshing the edge cache.
  - **Guarantee:** 60-second convergence. In exchange, the public storefront loads in **45 milliseconds** globally without hammering our database origin.

---

## 3. The Double-Click Nightmare: Distributed Idempotency

Imagine Rajesh's cashier is billing a customer ₹882. 
The internet drops momentarily. The cashier thinks the screen froze and taps "Charge UPI" three times in rapid succession.

Without distributed idempotency:
- The backend executes three `insert_one` calls.
- Three duplicate invoices are generated.
- Inventory is deducted three times (6 kebabs instead of 2).
- The merchant's daily books are corrupted.

### Our Solution: Distributed Idempotency Keys
The frontend generates a unique transaction UUID (`idempotency_key`) before sending the request. The backend uses an atomic database session:

```python
# backend/app/routers/invoices.py (Production Implementation)

async def issue_invoice(payload: InvoiceCreateRequest, business_id: str):
    # STEP 1: Check if this idempotency key was already processed
    existing = await db.invoices.find_one({
        "business_id": ObjectId(business_id),
        "idempotency_key": payload.idempotency_key
    })
    if existing:
        # RETURN IMMEDIATELY! Do not charge again, do not decrement stock twice!
        return existing
        
    # STEP 2: Atomic Multi-Document Transaction
    async with await db.client.start_session() as session:
        async with session.start_transaction():
            # Write invoice
            await db.invoices.insert_one(payload.dict(), session=session)
            
            # Decrement stock atomically
            for item in payload.items:
                await db.inventory.update_one(
                    {"sku": item.sku, "business_id": ObjectId(business_id)},
                    {"$inc": {"quantity": -item.qty}},
                    session=session
                )
```

---

## 4. Handling Split-Brain & Database Failover

What happens if the primary database node in AWS Mumbai loses network connectivity?
1. The secondary nodes detect missing heartbeats after 2 seconds.
2. The replica set triggers a **Raft-based consensus election**. A secondary with the most up-to-date oplog is promoted to primary in **under 3 seconds**.
3. In our backend, the Motor client pool is initialized with `retryWrites=true`. 
4. The Python worker automatically buffers the write, waits for the new primary to announce its topology, and replays the write seamlessly. The merchant never sees an error.

---

## 5. How to Defend Distributed Systems in an Interview

### 🎤 The Interviewer's Question:
> *"How do you handle consistency across your distributed tiers, and what trade-offs did you make?"*

### 💡 Your Killer Answer:
> *"We apply the CAP theorem pragmatically by dividing our system into two distinct consistency domains.
> 
> For our transactional core—invoices, inventory, and DPDP consent—we enforce Strong Consistency using MongoDB's `majority` write concern within multi-document ACID transactions. We also enforce idempotency keys on all write payloads to protect against network retries and duplicate mobile clicks.
> 
> For our public storefronts, we embrace Eventual Consistency. We use Next.js Incremental Static Regeneration (ISR) with a 60-second stale-while-revalidate window. A price update takes up to 60 seconds to propagate to global edge nodes, but in return, 99% of visitor traffic is served directly from edge CDN cache in under 50ms, protecting our origin backend from traffic spikes."*
