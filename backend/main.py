"""
Tournament Aggregator Backend - FastAPI Application
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import List

# =====================================
# DATABASE SETUP
# =====================================

DATABASE_URL = "sqlite:///./tournaments.db"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# =====================================
# MODELS & SCHEMAS
# =====================================

class TournamentStatus(str, Enum):
    """Tournament status enum"""
    LIVE = "LIVE"
    UPCOMING = "UPCOMING"
    COMPLETED = "COMPLETED"


class TournamentDB(Base):
    """SQLAlchemy model for Tournament"""
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    game_name = Column(String)
    stream_url = Column(String)
    image_url = Column(String)
    status = Column(SQLEnum(TournamentStatus), default=TournamentStatus.UPCOMING)
    start_time = Column(DateTime, default=datetime.utcnow)


class TournamentSchema(BaseModel):
    """Pydantic schema for Tournament (Request/Response)"""
    id: int
    title: str
    game_name: str
    stream_url: str
    image_url: str
    status: TournamentStatus
    start_time: datetime

    class Config:
        from_attributes = True


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
    title: str | None = None
    game_name: str | None = None
    stream_url: str | None = None
    image_url: str | None = None
    status: TournamentStatus | None = None
    start_time: datetime | None = None


# =====================================
# FASTAPI APP SETUP
# =====================================

app = FastAPI(title="Tournament Aggregator API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================
# CRUD ENDPOINTS
# =====================================

@app.get("/tournaments", response_model=List[TournamentSchema])
def get_tournaments(db: Session = None):
    """Fetch all tournaments, sorted by LIVE status first"""
    db = SessionLocal()
    try:
        # First get LIVE tournaments, then others
        live_tournaments = db.query(TournamentDB).filter(
            TournamentDB.status == TournamentStatus.LIVE
        ).all()
        
        other_tournaments = db.query(TournamentDB).filter(
            TournamentDB.status != TournamentStatus.LIVE
        ).order_by(TournamentDB.start_time).all()
        
        return live_tournaments + other_tournaments
    finally:
        db.close()


@app.post("/tournaments", response_model=TournamentSchema, status_code=status.HTTP_201_CREATED)
def create_tournament(tournament: TournamentCreateSchema, db: Session = None):
    """Create a new tournament"""
    db = SessionLocal()
    try:
        db_tournament = TournamentDB(**tournament.model_dump())
        db.add(db_tournament)
        db.commit()
        db.refresh(db_tournament)
        return db_tournament
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()


@app.put("/tournaments/{tournament_id}", response_model=TournamentSchema)
def update_tournament(tournament_id: int, tournament: TournamentUpdateSchema, db: Session = None):
    """Update a tournament by ID"""
    db = SessionLocal()
    try:
        db_tournament = db.query(TournamentDB).filter(
            TournamentDB.id == tournament_id
        ).first()
        
        if not db_tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        # Update only provided fields
        update_data = tournament.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_tournament, field, value)
        
        db.commit()
        db.refresh(db_tournament)
        return db_tournament
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()


@app.delete("/tournaments/{tournament_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament(tournament_id: int, db: Session = None):
    """Delete a tournament by ID"""
    db = SessionLocal()
    try:
        db_tournament = db.query(TournamentDB).filter(
            TournamentDB.id == tournament_id
        ).first()
        
        if not db_tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        db.delete(db_tournament)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
