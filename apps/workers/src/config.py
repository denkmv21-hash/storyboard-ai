"""
Configuration settings for Storyboard AI Workers
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    api_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3000"
    environment: str = "development"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    redis_host: str = "localhost"
    redis_port: int = 6379
    
    # Replicate (Image Generation)
    replicate_api_key: Optional[str] = None
    replicate_model_version: str = "sdxl-1.0"
    
    # OpenAI (Prompt Processing)
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4o-mini"
    
    # Supabase
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
    
    # Generation Settings
    max_concurrent_generations: int = 3
    generation_timeout_seconds: int = 60
    max_retries: int = 3
    
    # Debug
    debug_ai: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
