"""
Storyboard AI Workers - Background Worker Process
Processes generation jobs from Redis queue
"""

import asyncio
import logging
import signal
import sys

from config import settings
from services.queue_manager import queue_manager
from services.image_generator import generate_image

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


class Worker:
    """Background worker for processing generation jobs"""
    
    def __init__(self):
        self.running = True
        
    def shutdown(self, signum=None, frame=None):
        """Graceful shutdown"""
        logger.info("Received shutdown signal, finishing current job...")
        self.running = False
    
    async def process_job(self, job: dict):
        """Process a single generation job"""
        job_id = job.get("id")
        scene_id = job.get("scene_id")
        prompt = job.get("prompt")
        
        logger.info(f"Processing job {job_id} for scene {scene_id}")
        
        try:
            # Update status to processing
            await queue_manager.update_job_status(job_id, "processing")
            
            # Generate image
            result = await generate_image(
                prompt=prompt,
                negative_prompt=job.get("negative_prompt"),
                style=job.get("style", "cinematic"),
                aspect_ratio=job.get("aspect_ratio", "16:9"),
                character_embedding=job.get("character_embedding"),
            )
            
            if result["success"]:
                await queue_manager.update_job_status(
                    job_id,
                    "completed",
                    image_url=result["image_url"],
                )
                logger.info(f"✅ Job {job_id} completed: {result['image_url']}")
            else:
                await queue_manager.update_job_status(
                    job_id,
                    "failed",
                    error_message=result.get("error"),
                )
                logger.error(f"❌ Job {job_id} failed: {result.get('error')}")
                
        except Exception as e:
            logger.exception(f"Job {job_id} error: {e}")
            await queue_manager.update_job_status(
                job_id,
                "failed",
                error_message=str(e),
            )
    
    async def run(self):
        """Main worker loop"""
        # Setup signal handlers
        signal.signal(signal.SIGINT, self.shutdown)
        signal.signal(signal.SIGTERM, self.shutdown)
        
        # Connect to Redis
        await queue_manager.connect()
        
        logger.info("👷 Worker started, waiting for jobs...")
        
        try:
            while self.running:
                # Get next job from queue
                job = await queue_manager.dequeue_job()
                
                if job:
                    await self.process_job(job)
                else:
                    # No jobs, wait a bit
                    await asyncio.sleep(1)
        finally:
            # Cleanup
            await queue_manager.disconnect()
            logger.info("Worker stopped")


async def main():
    """Entry point"""
    worker = Worker()
    await worker.run()


if __name__ == "__main__":
    asyncio.run(main())
