import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routers import (
    auth, master, requests, ai_planner, blocks, mcr, live_ops, analytics
)

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Indian Railways Maintenance Control Center API",
    description="Backend services for AI-Powered Automatic Block Planning and Maintenance Lifecycle Management",
    version="2.0.0"
)

# Configure CORS for local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(auth.router)
app.include_router(master.router)
app.include_router(requests.router)
app.include_router(ai_planner.router)
app.include_router(blocks.router)
app.include_router(mcr.router)
app.include_router(live_ops.router)
app.include_router(analytics.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "Indian Railways Maintenance & Block Planning System",
        "ai_engine": "Google OR-Tools CP-SAT",
        "version": "2.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
