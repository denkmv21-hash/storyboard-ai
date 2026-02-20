"""
Prompt engineering service - Convert scene descriptions to AI prompts
"""

import logging
from typing import Optional

from openai import AsyncOpenAI

from config import settings

logger = logging.getLogger(__name__)

# Camera angle descriptions
CAMERA_ANGLES = {
    "wide": "wide shot, establishing shot, full scene view",
    "medium": "medium shot, waist-up framing",
    "closeup": "close-up shot, detailed facial expression",
    "extreme-closeup": "extreme close-up, macro detail",
    "over-the-shoulder": "over-the-shoulder shot, perspective from behind character",
    "point-of-view": "point-of-view shot, first-person perspective",
}

# Time of day lighting
TIME_OF_DAY = {
    "dawn": "dawn lighting, soft golden hour, early morning light",
    "day": "bright daylight, natural lighting, clear visibility",
    "dusk": "dusk lighting, warm sunset glow, golden hour",
    "night": "night scene, moonlight, dark atmosphere, artificial lighting",
    "interior": "interior lighting, controlled environment",
}


async def enhance_prompt(
    description: str,
    style: str = "cinematic",
    characters: Optional[list[str]] = None,
    location: Optional[str] = None,
    time_of_day: str = "day",
    camera_angle: str = "medium",
) -> dict:
    """
    Enhance a scene description into a detailed AI image prompt
    
    Args:
        description: Basic scene description
        style: Visual style
        characters: List of character descriptions
        location: Scene location
        time_of_day: Lighting condition
        camera_angle: Camera framing
        
    Returns:
        Dictionary with enhanced prompt, negative prompt, and style tokens
    """
    # Build base prompt components
    components = [
        description,
        CAMERA_ANGLES.get(camera_angle, ""),
        TIME_OF_DAY.get(time_of_day, ""),
    ]
    
    if location:
        components.append(f"location: {location}")
    
    if characters:
        components.append(f"characters: {', '.join(characters)}")
    
    base_prompt = ", ".join(filter(None, components))
    
    # Use OpenAI to enhance if available
    if settings.openai_api_key:
        try:
            client = AsyncOpenAI(api_key=settings.openai_api_key)
            
            system_prompt = """You are an expert AI prompt engineer for image generation.
            Convert scene descriptions into detailed, visual prompts optimized for SDXL.
            Be specific about lighting, composition, mood, and visual details.
            Keep prompts concise but descriptive (under 200 words)."""
            
            user_prompt = f"""Enhance this scene description for image generation:
            
            Style: {style}
            Base description: {base_prompt}
            
            Output ONLY the enhanced prompt, no explanations."""
            
            response = await client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens=300,
                temperature=0.7,
            )
            
            enhanced = response.choices[0].message.content or base_prompt
            
            if settings.debug_ai:
                logger.info(f"🧠 OpenAI enhanced prompt: {enhanced}")
                
            return {
                "prompt": enhanced,
                "negative_prompt": "low quality, blurry, distorted, deformed, ugly, bad anatomy, extra limbs, watermark, text",
                "style_tokens": [style, camera_angle, time_of_day],
            }
            
        except Exception as e:
            logger.warning(f"OpenAI enhancement failed, using fallback: {e}")
    
    # Fallback: return basic enhancement
    style_modifiers = {
        "cinematic": "cinematic lighting, dramatic, professional photography, film grain",
        "anime": "anime style, studio ghibli, vibrant colors, detailed animation",
        "disney": "disney style, 3d animation, pixar-like, colorful, expressive",
        "pixar": "pixar style, 3d rendered, soft lighting, expressive characters",
        "noir": "film noir, black and white, high contrast, dramatic shadows",
        "sketch": "pencil sketch, hand drawn, artistic, monochrome, detailed lines",
    }
    
    enhanced = f"{base_prompt}, {style_modifiers.get(style, '')}"
    
    return {
        "prompt": enhanced,
        "negative_prompt": "low quality, blurry, distorted, deformed, ugly, bad anatomy, watermark, text",
        "style_tokens": [style, camera_angle, time_of_day],
    }
