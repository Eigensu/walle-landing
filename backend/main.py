"""
Tournament Aggregator Backend - FastAPI Application
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import List, Optional, Any
from bson import ObjectId
import os
import cloudinary
import cloudinary.uploader

# =====================================
# DATABASE SETUP
# =====================================

from dotenv import load_dotenv
from pathlib import Path

# Load .env from the backend directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "tournament_aggregator")


# Global variables for DB - initialized in startup
client: AsyncIOMotorClient = None
db = None
tournaments_collection = None
carousel_collection = None

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", ""),
    api_key=os.getenv("CLOUDINARY_API_KEY", ""),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", ""),
    secure=True
)





# Helper for ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


# =====================================
# MODELS & SCHEMAS
# =====================================

class TournamentStatus(str, Enum):
    """Tournament status enum"""
    LIVE = "LIVE"
    UPCOMING = "UPCOMING"
    COMPLETED = "COMPLETED"

class CarouselSlideSchema(BaseModel):
    id: str
    imageUrl: str
    headline: str = Field(..., max_length=120)
    description: str = Field(..., max_length=300)
    imagePosition: str = "center"
    isActive: bool
    order: int
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class CarouselSlideCreateSchema(BaseModel):
    imageUrl: str
    headline: str = Field(..., max_length=120)
    description: str = Field(..., max_length=300)
    imagePosition: str = "center"
    isActive: bool = True
    order: int = 0

class CarouselSlideUpdateSchema(BaseModel):
    imageUrl: Optional[str] = None
    headline: Optional[str] = Field(None, max_length=120)
    description: Optional[str] = Field(None, max_length=300)
    imagePosition: Optional[str] = None
    isActive: Optional[bool] = None
    order: Optional[int] = None


class TournamentSchema(BaseModel):
    """Pydantic schema for Tournament (Response)"""
    id: str
    title: str
    game_name: str
    stream_url: str
    image_url: str
    api_url: str
    status: TournamentStatus
    start_time: datetime

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class TournamentCreateSchema(BaseModel):
    """Pydantic schema for creating a Tournament"""
    title: str
    game_name: str
    stream_url: str
    image_url: str
    api_url: str
    status: TournamentStatus = TournamentStatus.UPCOMING
    start_time: datetime


class TournamentUpdateSchema(BaseModel):
    """Pydantic schema for updating a Tournament"""
    title: Optional[str] = None
    game_name: Optional[str] = None
    stream_url: Optional[str] = None
    image_url: Optional[str] = None
    api_url: Optional[str] = None
    status: Optional[TournamentStatus] = None
    start_time: Optional[datetime] = None


# =====================================
# FASTAPI APP SETUP
# =====================================

app = FastAPI(title="Walle Arena API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://wallearena.com",
        "https://www.wallearena.com",
        "capacitor://localhost",  # Common for mobile apps
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_db_client():
    """Connect to MongoDB on startup"""
    global client, db, tournaments_collection
    try:
        print(f"Connecting to MongoDB: {MONGODB_URL.split('@')[1] if '@' in MONGODB_URL else MONGODB_URL}")
        client = AsyncIOMotorClient(MONGODB_URL, tlsAllowInvalidCertificates=True)
        db = client[DATABASE_NAME]
        tournaments_collection = db["tournaments"]
        global carousel_collection
        carousel_collection = db["carousel_slides"]
        print("Connected to MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close MongoDB connection on shutdown"""
    global client
    if client:
        client.close()



# =====================================
# CRUD ENDPOINTS
# =====================================

@app.get("/tournaments", response_model=List[TournamentSchema])
async def get_tournaments():
    """Fetch all tournaments, sorted by LIVE status first"""
    try:
        # First get LIVE tournaments
        live_tournaments = await tournaments_collection.find(
            {"status": TournamentStatus.LIVE}
        ).to_list(None)
        
        # Then get other tournaments sorted by start_time
        other_tournaments = await tournaments_collection.find(
            {"status": {"$ne": TournamentStatus.LIVE}}
        ).sort("start_time", 1).to_list(None)
        
        all_tournaments = live_tournaments + other_tournaments
        
        # Convert _id to id for each tournament
        result = []
        for tournament in all_tournaments:
            tournament_dict = dict(tournament)
            tournament_dict["id"] = str(tournament_dict.pop("_id"))
            result.append(TournamentSchema(**tournament_dict))
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tournaments/{tournament_id}", response_model=TournamentSchema)
async def get_tournament(tournament_id: str):
    """Get a specific tournament by ID"""
    try:
        if not ObjectId.is_valid(tournament_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid tournament ID format"
            )
        
        tournament = await tournaments_collection.find_one({"_id": ObjectId(tournament_id)})
        
        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        # Convert _id to id
        tournament_dict = dict(tournament)
        tournament_dict["id"] = str(tournament_dict.pop("_id"))
        return TournamentSchema(**tournament_dict)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/tournaments/{tournament_id}/api-url")
async def get_tournament_api_url(tournament_id: str):
    """Get the API URL for a specific tournament"""
    try:
        if not ObjectId.is_valid(tournament_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid tournament ID format"
            )
        
        tournament = await tournaments_collection.find_one(
            {"_id": ObjectId(tournament_id)}, 
            {"api_url": 1}
        )
        
        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        return {"api_url": tournament.get("api_url", "")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/tournaments", response_model=TournamentSchema, status_code=status.HTTP_201_CREATED)
async def create_tournament(tournament: TournamentCreateSchema):
    """Create a new tournament"""
    try:
        tournament_dict = tournament.model_dump()
        result = await tournaments_collection.insert_one(tournament_dict)
        
        created_tournament = await tournaments_collection.find_one({"_id": result.inserted_id})
        
        # Convert _id to id
        tournament_dict = dict(created_tournament)
        tournament_dict["id"] = str(tournament_dict.pop("_id"))
        return TournamentSchema(**tournament_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.put("/tournaments/{tournament_id}", response_model=TournamentSchema)
async def update_tournament(tournament_id: str, tournament: TournamentUpdateSchema):
    """Update a tournament by ID"""
    try:
        if not ObjectId.is_valid(tournament_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid tournament ID format"
            )
        
        # Update only provided fields
        update_data = {k: v for k, v in tournament.model_dump(exclude_unset=True).items() if v is not None}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        result = await tournaments_collection.update_one(
            {"_id": ObjectId(tournament_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        updated_tournament = await tournaments_collection.find_one({"_id": ObjectId(tournament_id)})
        
        # Convert _id to id
        tournament_dict = dict(updated_tournament)
        tournament_dict["id"] = str(tournament_dict.pop("_id"))
        return TournamentSchema(**tournament_dict)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/tournaments/{tournament_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tournament(tournament_id: str):
    """Delete a tournament by ID"""
    try:
        if not ObjectId.is_valid(tournament_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid tournament ID format"
            )
        
        result = await tournaments_collection.delete_one({"_id": ObjectId(tournament_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

async def reindex_slides():
    """Ensure all slides have sequential unique orders (1, 2, 3...)"""
    # Sort by order ascending, then by updatedAt descending so the most recently updated duplicate wins the lower order position
    slides = await carousel_collection.find().sort([("order", 1), ("updatedAt", -1)]).to_list(None)
    for index, s in enumerate(slides):
        new_order = index + 1
        if s.get("order") != new_order:
            await carousel_collection.update_one(
                {"_id": s["_id"]},
                {"$set": {"order": new_order}}
            )

# =====================================
# CAROUSEL ENDPOINTS
# =====================================

@app.get("/carousel", response_model=List[CarouselSlideSchema])
async def get_active_carousel_slides():
    """Fetch active carousel slides, sorted by order"""
    try:
        slides = await carousel_collection.find({"isActive": True}).sort("order", 1).to_list(None)
        
        result = []
        for slide in slides:
            slide_dict = dict(slide)
            slide_dict["id"] = str(slide_dict.pop("_id"))
            result.append(CarouselSlideSchema(**slide_dict))
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/carousel/all", response_model=List[CarouselSlideSchema])
async def get_all_carousel_slides():
    """Fetch all carousel slides for admin"""
    try:
        slides = await carousel_collection.find().sort("order", 1).to_list(None)
        
        result = []
        for slide in slides:
            slide_dict = dict(slide)
            slide_dict["id"] = str(slide_dict.pop("_id"))
            result.append(CarouselSlideSchema(**slide_dict))
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/carousel", response_model=CarouselSlideSchema, status_code=status.HTTP_201_CREATED)
async def create_carousel_slide(slide: CarouselSlideCreateSchema):
    """Create a new carousel slide"""
    try:
        slide_dict = slide.model_dump()
        slide_dict["createdAt"] = datetime.utcnow()
        slide_dict["updatedAt"] = datetime.utcnow()
        result = await carousel_collection.insert_one(slide_dict)
        
        await reindex_slides()
        
        created_slide = await carousel_collection.find_one({"_id": result.inserted_id})
        
        # Convert _id to id
        created_slide_dict = dict(created_slide)
        created_slide_dict["id"] = str(created_slide_dict.pop("_id"))
        return CarouselSlideSchema(**created_slide_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/carousel/{slide_id}", response_model=CarouselSlideSchema)
async def update_carousel_slide(slide_id: str, slide: CarouselSlideUpdateSchema):
    """Update a carousel slide by ID"""
    try:
        if not ObjectId.is_valid(slide_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid slide ID format"
            )
        
        update_data = {k: v for k, v in slide.model_dump(exclude_unset=True).items() if v is not None}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await carousel_collection.update_one(
            {"_id": ObjectId(slide_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Slide not found"
            )
            
        await reindex_slides()
        
        updated_slide = await carousel_collection.find_one({"_id": ObjectId(slide_id)})
        
        updated_slide_dict = dict(updated_slide)
        updated_slide_dict["id"] = str(updated_slide_dict.pop("_id"))
        return CarouselSlideSchema(**updated_slide_dict)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/carousel/{slide_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_carousel_slide(slide_id: str):
    """Delete a carousel slide by ID"""
    try:
        if not ObjectId.is_valid(slide_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid slide ID format"
            )
        
        result = await carousel_collection.delete_one({"_id": ObjectId(slide_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Slide not found"
            )
            
        await reindex_slides()
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.patch("/carousel/{slide_id}/toggle", response_model=CarouselSlideSchema)
async def toggle_carousel_slide(slide_id: str):
    """Toggle a carousel slide's active status"""
    try:
        if not ObjectId.is_valid(slide_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid slide ID format"
            )
            
        slide = await carousel_collection.find_one({"_id": ObjectId(slide_id)})
        if not slide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Slide not found"
            )
            
        new_status = not slide.get("isActive", False)
        
        await carousel_collection.update_one(
            {"_id": ObjectId(slide_id)},
            {"$set": {"isActive": new_status, "updatedAt": datetime.utcnow()}}
        )
        
        updated_slide = await carousel_collection.find_one({"_id": ObjectId(slide_id)})
        updated_slide_dict = dict(updated_slide)
        updated_slide_dict["id"] = str(updated_slide_dict.pop("_id"))
        return CarouselSlideSchema(**updated_slide_dict)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from fastapi import File, UploadFile
MAX_FILE_SIZE = 10 * 1024 * 1024 # 10MB
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image to Cloudinary"""
    try:
        # Validate file type
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed."
            )
            
        # Validate file size (reading into memory to check size)
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File too large. Maximum size is 10MB."
            )
            
        if not os.getenv("CLOUDINARY_CLOUD_NAME"):
            # Fallback to local filesystem upload if Cloudinary is missing
            import shutil
            import time
            
            upload_dir = Path(__file__).resolve().parent.parent / "frontend" / "public" / "uploads"
            upload_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate unique filename
            ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
            filename = f"upload_{int(time.time())}.{ext}"
            file_path = upload_dir / filename
            
            with open(file_path, "wb") as f:
                f.write(file_content)
                
            return {"url": f"/uploads/{filename}"}
            
        result = cloudinary.uploader.upload(file_content)
        return {"url": result.get("secure_url")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)