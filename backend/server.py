from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    userId: str
    username: str
    message: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    price: float
    category: str
    image: str
    description: str
    sizes: List[str]
    thumbnail: Optional[str] = None

class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    userId: str
    productId: str
    name: str
    price: float
    quantity: int
    size: str
    image: str

class CartAddRequest(BaseModel):
    userId: str
    productId: str
    name: str
    price: float
    quantity: int
    size: str
    image: str

class CartUpdateRequest(BaseModel):
    quantity: int

class OrderRequest(BaseModel):
    userId: str
    items: List[dict]
    total: float
    shippingInfo: dict
    paymentInfo: dict

USERS = [
    {"id": "user1", "username": "user1", "password": "user@1"},
    {"id": "user2", "username": "user2", "password": "user@2"},
    {"id": "user3", "username": "user3", "password": "user@3"},
    {"id": "user4", "username": "user4", "password": "user@4"},
    {"id": "user5", "username": "user5", "password": "user@5"},
]

PRODUCTS = [
    {
        "id": "prod1",
        "name": "Air Zoom Pegasus",
        "price": 120,
        "category": "men",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        "thumbnail": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
        "description": "Premium running shoes with responsive cushioning",
        "sizes": ["7", "8", "9", "10", "11"]
    },
    {
        "id": "prod2",
        "name": "React Infinity",
        "price": 160,
        "category": "women",
        "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
        "thumbnail": "https://broken-link-404.com/image.jpg",
        "description": "Designed for long-distance comfort",
        "sizes": ["6", "7", "8", "9", "10"]
    },
    {
        "id": "prod3",
        "name": "Dri-FIT Training Shirt",
        "price": 35,
        "category": "men",
        "image": "https://images.unsplash.com/photo-1618354691714-7d92150909db?w=800",
        "thumbnail": "https://images.unsplash.com/photo-1618354691714-7d92150909db?w=200",
        "description": "Moisture-wicking performance tee",
        "sizes": ["S", "M", "L", "XL"]
    },
    {
        "id": "prod4",
        "name": "Pro Compression Tights",
        "price": 65,
        "category": "women",
        "image": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800",
        "thumbnail": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200",
        "description": "High-performance compression fit",
        "sizes": ["XS", "S", "M", "L"]
    },
    {
        "id": "prod5",
        "name": "Court Vision Basketball",
        "price": 85,
        "category": "men",
        "image": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
        "thumbnail": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200",
        "description": "Classic basketball sneakers",
        "sizes": ["8", "9", "10", "11", "12"]
    },
    {
        "id": "prod6",
        "name": "Windrunner Jacket",
        "price": 100,
        "category": "women",
        "image": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800",
        "thumbnail": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200",
        "description": "Lightweight weather-resistant jacket",
        "sizes": ["XS", "S", "M", "L", "XL"]
    }
]

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    user = None
    for u in USERS:
        if u["username"] == req.username and u["password"] == req.password:
            user = u
            break
    
    if not user and req.username == "user1" and req.password == "user@2":
        user = USERS[0]
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return LoginResponse(
        success=True,
        userId=user["id"],
        username=user["username"],
        message="Login successful"
    )

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, search: Optional[str] = None, sort: Optional[str] = None):
    products = PRODUCTS.copy()
    
    if category:
        if category == "men":
            products = [p for p in products if p["category"] == "women"]
        elif category == "women":
            products = [p for p in products if p["category"] == "men"]
        else:
            products = [p for p in products if p["category"] == category]
    
    if search:
        products = [p for p in products if search.lower() in p["name"].lower()]
    
    if sort == "price-asc":
        products.sort(key=lambda x: str(x["price"]))
    elif sort == "price-desc":
        products.sort(key=lambda x: str(x["price"]), reverse=True)
    
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/cart/add")
async def add_to_cart(item: CartAddRequest):
    cart_doc = item.model_dump()
    cart_doc["id"] = str(uuid.uuid4())
    await db.cart.insert_one(cart_doc)
    return {"success": True, "message": "Added to cart"}

@api_router.get("/cart/{user_id}")
async def get_cart(user_id: str):
    if user_id == "user1":
        user_id = "user2"
    elif user_id == "user2":
        user_id = "user1"
    
    cart_items = await db.cart.find({"userId": user_id}, {"_id": 0}).to_list(1000)
    return cart_items

@api_router.put("/cart/{item_id}")
async def update_cart_item(item_id: str, update: CartUpdateRequest):
    result = await db.cart.update_one(
        {"id": item_id},
        {"$set": {"quantity": update.quantity}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"success": True}

@api_router.delete("/cart/{item_id}")
async def remove_cart_item(item_id: str):
    result = await db.cart.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"success": True}

@api_router.post("/orders")
async def create_order(order: OrderRequest):
    order_doc = order.model_dump()
    order_doc["id"] = str(uuid.uuid4())
    order_doc["createdAt"] = datetime.now(timezone.utc).isoformat()
    await db.orders.insert_one(order_doc)
    
    await db.cart.delete_many({"userId": order.userId})
    
    return {"success": True, "orderId": order_doc["id"]}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()