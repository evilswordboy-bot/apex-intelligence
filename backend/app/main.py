from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.database import init_db
from app.routers.cricket import router as cricket_router
from app.routers.agent import router as agent_router
from app.routers.analytics import router as analytics_router
from app.routers.live import router as live_router
from app.routers.predictions import router as predictions_router
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.platform import router as platform_router

app = FastAPI(
    title="APEX Sports Intelligence Engine API",
    description="Production-grade backend API powering the APEX Sports Intelligence Platform with calibrated ML win probability, multi-sport analytics, live match telemetry, AI match prediction engine, user accounts, and platform monitoring.",
    version="10.0.0"
)

# Configure CORS for Next.js frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Production Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response

# Startup event to ensure SQLite tables exist
@app.on_event("startup")
def on_startup():
    init_db()

# Mount routers
app.include_router(cricket_router)
app.include_router(agent_router)
app.include_router(analytics_router)
app.include_router(live_router)
app.include_router(predictions_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(platform_router)

@app.get("/")
def root():
    return {
        "engine": "APEX Sports Intelligence API",
        "version": "10.0.0",
        "status": "online",
        "modules": [
            "Cricket Intelligence Lab",
            "AI Sports Intelligence Agent",
            "Advanced Multi-Sport Analytics",
            "Live Match Centre",
            "AI Sports Prediction Engine",
            "User Accounts & Personalization",
            "Platform Monitoring & Feedback"
        ],
        "docs_url": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": "9.0.0",
        "database": "sqlite_ready",
        "prediction_models": "active",
        "win_probability_model": "calibrated_logistic_regression_active"
    }

# Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "InternalServerError", "detail": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
