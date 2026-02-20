"""
Storyboard AI Workers - AI Service Entry Point
FastAPI application for image generation and prompt processing
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import generation, prompts, health

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    logger.info("🚀 Starting Storyboard AI Workers...")
    logger.info(f"📍 API URL: {settings.api_url}")
    logger.info(f"🤖 Replicate enabled: {bool(settings.replicate_api_key)}")
    logger.info(f"🧠 OpenAI enabled: {bool(settings.openai_api_key)}")
    yield
    logger.info("👋 Shutting down Storyboard AI Workers...")


app = FastAPI(
    title="Storyboard AI Workers",
    description="AI service for image generation and prompt processing",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router, tags=["health"])
app.include_router(generation.router, prefix="/api/generation", tags=["generation"])
app.include_router(prompts.router, prefix="/api/prompts", tags=["prompts"])


@app.get("/")
async def root():
    return {
        "name": "Storyboard AI Workers",
        "version": "0.1.0",
        "status": "running",
    }
