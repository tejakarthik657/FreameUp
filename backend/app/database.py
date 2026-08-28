from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.mongo_uri)
db = client[settings.mongo_db_name]

users_collection = db["users"]
businesses_collection = db["businesses"]
websites_collection = db["websites"]
leads_collection = db["leads"]
