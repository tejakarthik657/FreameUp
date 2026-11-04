# 04. Motor & Async MongoDB Mastery: The High-Throughput Data Layer
## The Core Backend Engineer's Masterclass: Non-Blocking Database Engineering

> **Instructor's Note:** If you use PyMongo in an async FastAPI application, your server will silently block threads on every query. 
> 
> To achieve true asynchronous performance, we use **Motor (`AsyncIOMotorClient`)**—the official async driver that communicates directly with MongoDB Atlas via non-blocking TCP streams. In this guide, you will master connection pools, BSON conversions, compound B-Trees, and multi-document ACID transactions.

---

## 1. Initializing Motor in FastAPI Lifespan

We never initialize a new database connection on every HTTP request. Creating a TCP connection, completing TLS handshakes, and authenticating credentials takes **150ms to 300ms**.

Instead, we create a single, shared connection pool during application boot:

```python
# backend/app/database.py (Production Implementation)

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

class DatabaseManager:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db_manager = DatabaseManager()

async def init_db():
    """Called during FastAPI lifespan startup."""
    db_manager.client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        maxPoolSize=50,          # Up to 50 active TCP sockets
        minPoolSize=10,          # Keep 10 idle sockets warm in memory
        serverSelectionTimeoutMS=5000, # Fail fast after 5s if cluster down
        retryWrites=True         # Automatically retry transient replica failovers
    )
    db_manager.db = db_manager.client[settings.DATABASE_NAME]
    
    # Initialize Compound & TTL Indexes
    await setup_indexes(db_manager.db)

async def close_db():
    """Called during FastAPI lifespan shutdown."""
    if db_manager.client:
        db_manager.client.close()
```

---

## 2. BSON `ObjectId` vs Python Strings (The #1 Junior Mistake)

In MongoDB, document identifiers are stored as 12-byte binary BSON objects: `ObjectId('66d1a980e1b2c3d4e5f60001')`.
In JSON, IDs travel over HTTP as 24-character hex strings: `"66d1a980e1b2c3d4e5f60001"`.

### The Bug:
```python
# THIS QUERY RETURNS NONE! (String compared against BSON ObjectId)
user = await db.users.find_one({"_id": user_id_str}) 
```

### The Fix:
Always wrap hex strings in `ObjectId()` when querying, and convert `_id` to string before returning:
```python
from bson import ObjectId

# Wrap string in ObjectId for database query
user = await db.users.find_one({"_id": ObjectId(user_id_str)})

# Convert BSON ObjectId back to string for Pydantic serialization
if user:
    user["id"] = str(user["_id"])
```

---

## 3. Compound Indexes: The Physics of Query Optimization

```mermaid
graph TD
    Query["find({'business_id': B, 'created_at': {'$gte': T}}).sort('created_at', -1)"]
    
    subgraph Without Compound Index
        Scan1[Full Collection Scan: COLLSCAN]
        Scan1 --> ReadDisk[Reads 50,000 documents off disk into RAM]
        ReadDisk --> MemorySort[In-Memory QuickSort in Python]
        MemorySort --> HighLatency[Latency: 140ms - CPU Spike!]
    end

    subgraph With Compound Index: (business_id: 1, created_at: -1)
        BTree[B-Tree Index Scan: IXSCAN]
        BTree --> Traverse[Traverses pre-sorted B-Tree directly to tenant B]
        Traverse --> ExactFetch[Fetches exactly 10 matching documents]
        ExactFetch --> SubMillisecond[Latency: 1.2ms - Zero CPU Spike!]
    end
```

### Production Index Setup in `backend/app/database.py`:
```python
async def setup_indexes(db: AsyncIOMotorDatabase):
    # Storefront Subdomain Uniqueness
    await db.websites.create_index([("slug", 1)], unique=True)
    
    # Storefront Multi-Tenant Lookups
    await db.websites.create_index([("business_id", 1), ("is_published", 1)])
    
    # Financial Invoices Pagination (Equality on business_id, Sort on created_at)
    await db.invoices.create_index([("business_id", 1), ("created_at", -1)])
    
    # Unique Invoice Number per Business
    await db.invoices.create_index([("business_id", 1), ("invoice_number", 1)], unique=True)
    
    # Statutory DPDP TTL Automated Data Purging
    await db.dpdp_certificates.create_index([("expires_at", 1)], expireAfterSeconds=0)
```

---

## 4. Multi-Document ACID Transactions

When an invoice is issued, inventory must be decremented and the invoice created as an atomic unit:

```python
# backend/app/routers/invoices.py
async def record_transaction(invoice_data: dict, items: list, business_id: str):
    async with await db_manager.client.start_session() as session:
        async with session.start_transaction():
            # 1. Insert Invoice Document
            await db_manager.db.invoices.insert_one(invoice_data, session=session)
            
            # 2. Decrement Inventory Quantities
            for item in items:
                result = await db_manager.db.inventory.update_one(
                    {
                        "sku": item["sku"], 
                        "business_id": ObjectId(business_id),
                        "quantity": {"$gte": item["qty"]} # Enforce stock availability!
                    },
                    {"$inc": {"quantity": -item["qty"]}},
                    session=session
                )
                if result.matched_count == 0:
                    # Rolling back transaction automatically!
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Insufficient stock for SKU: {item['sku']}"
                    )
```
If any item has insufficient stock, the transaction aborts. The invoice is **not** created, and no inventory counts are altered.
