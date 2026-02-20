"""
Redis queue manager for generation jobs
"""

import json
import logging
import uuid
from typing import Any, Dict
import redis.asyncio as redis

from config import settings

logger = logging.getLogger(__name__)


class QueueManager:
    """Manage generation jobs in Redis queue"""
    
    def __init__(self):
        self.redis: redis.Redis | None = None
    
    async def connect(self):
        """Initialize Redis connection"""
        try:
            self.redis = redis.Redis(
                host=settings.redis_host,
                port=settings.redis_port,
                decode_responses=True,
            )
            await self.redis.ping()
            logger.info("✅ Redis connected")
        except Exception as e:
            logger.error(f"❌ Redis connection failed: {e}")
            self.redis = None
    
    async def disconnect(self):
        """Close Redis connection"""
        if self.redis:
            await self.redis.close()
            logger.info("Redis disconnected")
    
    async def queue_generation_job(self, job_data: Dict[str, Any]) -> str:
        """
        Add a generation job to the queue
        
        Args:
            job_data: Dictionary with job parameters
            
        Returns:
            Job ID
        """
        job_id = str(uuid.uuid4())
        
        job = {
            "id": job_id,
            "status": "queued",
            **job_data,
        }
        
        if self.redis:
            # Add to processing queue
            await self.redis.lpush("generation_queue", json.dumps(job))
            
            # Store job details
            await self.redis.set(
                f"job:{job_id}",
                json.dumps(job),
                ex=3600,  # 1 hour TTL
            )
        
        logger.info(f"Job queued: {job_id}")
        return job_id
    
    async def get_job_status(self, job_id: str) -> Dict[str, Any] | None:
        """Get status of a generation job"""
        if not self.redis:
            return None
        
        job_data = await self.redis.get(f"job:{job_id}")
        if job_data:
            return json.loads(job_data)
        return None
    
    async def update_job_status(
        self,
        job_id: str,
        status: str,
        image_url: str | None = None,
        error_message: str | None = None,
    ):
        """Update job status"""
        if not self.redis:
            return
        
        job_data = await self.get_job_status(job_id)
        if job_data:
            job_data["status"] = status
            if image_url:
                job_data["image_url"] = image_url
            if error_message:
                job_data["error_message"] = error_message
            
            await self.redis.set(
                f"job:{job_id}",
                json.dumps(job_data),
                ex=3600,
            )
    
    async def dequeue_job(self) -> Dict[str, Any] | None:
        """Get next job from queue (for worker processing)"""
        if not self.redis:
            return None
        
        result = await self.redis.brpop("generation_queue", timeout=5)
        if result:
            _, job_data = result
            return json.loads(job_data)
        return None


# Global instance
queue_manager = QueueManager()


# Convenience functions
async def queue_generation_job(job_data: Dict[str, Any]) -> str:
    return await queue_manager.queue_generation_job(job_data)


async def get_job_status(job_id: str) -> Dict[str, Any] | None:
    return await queue_manager.get_job_status(job_id)
