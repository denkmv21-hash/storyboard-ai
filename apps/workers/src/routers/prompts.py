"""
Prompt processing router - Convert scene descriptions to AI image prompts
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.prompt_engineer import enhance_prompt

logger = logging.getLogger(__name__)

router = APIRouter()


class PromptRequest(BaseModel):
    scene_description: str = Field(..., min_length=10)
    style: str = "cinematic"
    characters: list[str] = Field(default_factory=list)
    location: str | None = None
    time_of_day: str = "day"
    camera_angle: str = "medium"


class PromptResponse(BaseModel):
    enhanced_prompt: str
    negative_prompt: str
    style_tokens: list[str]


@router.post("/enhance", response_model=PromptResponse)
async def enhance_scene_prompt(request: PromptRequest):
    """
    Enhance a scene description into a detailed AI image prompt
    """
    try:
        result = await enhance_prompt(
            description=request.scene_description,
            style=request.style,
            characters=request.characters,
            location=request.location,
            time_of_day=request.time_of_day,
            camera_angle=request.camera_angle,
        )
        
        return PromptResponse(
            enhanced_prompt=result["prompt"],
            negative_prompt=result["negative_prompt"],
            style_tokens=result["style_tokens"]
        )
    except Exception as e:
        logger.error(f"Failed to enhance prompt: {e}")
        raise HTTPException(status_code=500, detail=str(e))
