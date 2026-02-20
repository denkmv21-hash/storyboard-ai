"""
Image generation router
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field

from services.image_generator import generate_image
from services.queue_manager import queue_generation_job

logger = logging.getLogger(__name__)

router = APIRouter()


class GenerateImageRequest(BaseModel):
    scene_id: str
    prompt: str = Field(..., min_length=10)
    negative_prompt: Optional[str] = None
    style: str = "cinematic"
    aspect_ratio: str = "16:9"
    character_embedding: Optional[str] = None


class GenerateImageResponse(BaseModel):
    job_id: str
    status: str
    message: str


class GenerationStatus(BaseModel):
    job_id: str
    status: str
    image_url: Optional[str] = None
    error_message: Optional[str] = None


@router.post("/image", response_model=GenerateImageResponse)
async def create_generation_job(
    request: GenerateImageRequest,
    background_tasks: BackgroundTasks
):
    """
    Queue an image generation job
    """
    try:
        # Queue the job
        job_id = await queue_generation_job({
            "scene_id": request.scene_id,
            "prompt": request.prompt,
            "negative_prompt": request.negative_prompt,
            "style": request.style,
            "aspect_ratio": request.aspect_ratio,
            "character_embedding": request.character_embedding,
        })
        
        logger.info(f"Generation job queued: {job_id}")
        
        return GenerateImageResponse(
            job_id=job_id,
            status="queued",
            message="Image generation started"
        )
    except Exception as e:
        logger.error(f"Failed to queue generation job: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/job/{job_id}", response_model=GenerationStatus)
async def get_generation_status(job_id: str):
    """
    Get the status of a generation job
    """
    # TODO: Implement status lookup from Redis/Database
    return GenerationStatus(
        job_id=job_id,
        status="pending"
    )
