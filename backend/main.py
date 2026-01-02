"""
Tournament Aggregator Backend - FastAPI Application
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import List, Optional
from bson import ObjectId
import os

# =====================================
# DATABASE SETUP
# =====================================

MONGODB_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "tournament_aggregator")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]
tournaments_collection = db["tournaments"]


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


class TournamentSchema(BaseModel):
    """Pydantic schema for Tournament (Response)"""
    id: str = Field(alias="_id")
    title: str
    game_name: str
    stream_url: str
    image_url: str
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
    status: TournamentStatus = TournamentStatus.UPCOMING
    start_time: datetime


class TournamentUpdateSchema(BaseModel):
    """Pydantic schema for updating a Tournament"""
    title: Optional[str] = None
    game_name: Optional[str] = None
    stream_url: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[TournamentStatus] = None
    start_time: Optional[datetime] = None


# =====================================
# FASTAPI APP SETUP
# =====================================

app = FastAPI(title="Tournament Aggregator API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_db_client():
    """Connect to MongoDB on startup"""
    pass


@app.on_event("shutdown")
async def shutdown_db_client():
    """Close MongoDB connection on shutdown"""
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
        return [TournamentSchema(**{**t, "_id": str(t["_id"])}) for t in all_tournaments]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/tournaments", response_model=TournamentSchema, status_code=status.HTTP_201_CREATED)
async def create_tournament(tournament: TournamentCreateSchema):
    """Create a new tournament"""
    try:
        tournament_dict = tournament.model_dump()
        result = await tournaments_collection.insert_one(tournament_dict)
        
        created_tournament = await tournaments_collection.find_one({"_id": result.inserted_id})
        return TournamentSchema(**{**created_tournament, "_id": str(created_tournament["_id"])})
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
        return TournamentSchema(**{**updated_tournament, "_id": str(updated_tournament["_id"])})
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
