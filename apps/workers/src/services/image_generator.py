"""
Image generation service using Replicate API
"""

import logging
import replicate
from typing import Optional, Dict, Any

from config import settings

logger = logging.getLogger(__name__)


async def generate_image(
    prompt: str,
    negative_prompt: Optional[str] = None,
    style: str = "cinematic",
    aspect_ratio: str = "16:9",
    character_embedding: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Generate an image using Replicate API (SDXL)
    
    Args:
        prompt: The text prompt for image generation
        negative_prompt: Things to avoid in the image
        style: Art style (cinematic, anime, disney, etc.)
        aspect_ratio: Image aspect ratio
        character_embedding: Optional IP-Adapter embedding for character consistency
        
    Returns:
        Dictionary with image URL and metadata
    """
    if settings.debug_ai:
        logger.info(f"🤖 PROMPT: {prompt}")
        logger.info(f"🤖 STYLE: {style}")
        logger.info(f"🤖 ASPECT RATIO: {aspect_ratio}")
    
    # Map aspect ratio to dimensions
    aspect_ratios = {
        "16:9": (1216, 688),
        "9:16": (688, 1216),
        "1:1": (1024, 1024),
        "2.35:1": (1536, 640),
    }
    width, height = aspect_ratios.get(aspect_ratio, (1024, 1024))
    
    # Style modifiers
    style_modifiers = {
        "cinematic": "cinematic lighting, film grain, dramatic, professional photography",
        "anime": "anime style, studio ghibli, vibrant colors, detailed",
        "disney": "disney style, 3d animation, pixar-like, colorful",
        "pixar": "pixar style, 3d rendered, soft lighting, expressive",
        "noir": "film noir, black and white, high contrast, dramatic shadows",
        "sketch": "pencil sketch, hand drawn, artistic, monochrome",
    }
    
    # Enhance prompt with style
    style_prompt = style_modifiers.get(style, "")
    full_prompt = f"{prompt}, {style_prompt}"
    
    if negative_prompt:
        full_negative = f"{negative_prompt}, low quality, blurry, distorted"
    else:
        full_negative = "low quality, blurry, distorted, deformed, ugly"
    
    try:
        # Run SDXL through Replicate
        output = replicate.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea351df4979778f7e9332fd5ab",
            input={
                "prompt": full_prompt,
                "negative_prompt": full_negative,
                "width": width,
                "height": height,
                "num_outputs": 1,
                "num_inference_steps": 30,
                "guidance_scale": 7.5,
                "scheduler": "DPMSolverMultistep",
            }
        )
        
        # Replicate returns a list with image URL
        image_url = output[0] if isinstance(output, list) else output
        
        logger.info(f"✅ Image generated: {image_url}")
        
        return {
            "success": True,
            "image_url": image_url,
            "prompt": full_prompt,
            "negative_prompt": full_negative,
            "metadata": {
                "width": width,
                "height": height,
                "style": style,
            }
        }
        
    except Exception as e:
        logger.error(f"Image generation failed: {e}")
        return {
            "success": False,
            "error": str(e),
        }


async def upscale_image(image_url: str) -> Dict[str, Any]:
    """
    Upscale an image using Replicate
    """
    try:
        output = replicate.run(
            "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
            input={
                "image": image_url,
                "scale": 2,
                "face_enhance": True,
            }
        )
        
        return {
            "success": True,
            "image_url": output,
        }
    except Exception as e:
        logger.error(f"Image upscaling failed: {e}")
        return {
            "success": False,
            "error": str(e),
        }
