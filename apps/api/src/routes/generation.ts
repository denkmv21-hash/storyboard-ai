import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { getSupabaseClient } from '../lib/supabase.js';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const generationRouter = Router();

// ===========================================
// SCHEMAS
// ===========================================

const GenerateImageSchema = z.object({
  sceneId: z.string().uuid(),
  prompt: z.string().min(10),
  negativePrompt: z.string().optional(),
  style: z.enum(['cinematic', 'anime', 'disney', 'pixar', 'noir', 'sketch']),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '2.35:1']),
});

// ===========================================
// MIDDLEWARE
// ===========================================

generationRouter.use(authMiddleware);

// ===========================================
// ROUTES
// ===========================================

/**
 * POST /api/generation/image
 * Generate image for a scene
 */
generationRouter.post('/image', async (req: AuthRequest, res, next) => {
  try {
    const body = GenerateImageSchema.parse(req.body);
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    // Verify scene ownership
    const { data: scene } = await supabase
      .from('scenes')
      .select('*, projects (user_id)')
      .eq('id', body.sceneId)
      .eq('projects.user_id', userId)
      .single();

    if (!scene) {
      throw AppError.notFound('Scene not found');
    }

    // Check user credits
    const { data: user } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!user || user.credits < 1) {
      throw AppError.forbidden('Insufficient credits');
    }

    // Create generation job
    const { data: job, error } = await supabase
      .from('generation_jobs')
      .insert({
        scene_id: body.sceneId,
        user_id: userId,
        status: 'queued',
        prompt: body.prompt,
        negative_prompt: body.negativePrompt || null,
        attempts: 0,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating generation job:', error);
      throw AppError.badRequest('Failed to create generation job');
    }

    // TODO: Queue job to Redis/BullMQ for AI worker

    // Update scene status
    await supabase
      .from('scenes')
      .update({ status: 'generating' })
      .eq('id', body.sceneId);

    logger.info(`Generation job created: ${job.id} for scene ${body.sceneId}`);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw AppError.badRequest('Invalid input', error.errors);
    }
    next(error);
  }
});

/**
 * POST /api/generation/:jobId/regenerate
 * Regenerate image with different seed
 */
generationRouter.post('/:jobId/regenerate', async (req: AuthRequest, res, next) => {
  try {
    const { jobId } = req.params;
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    // Get job and verify ownership
    const { data: job } = await supabase
      .from('generation_jobs')
      .select('*, scenes (projects (user_id))')
      .eq('id', jobId)
      .eq('scenes.projects.user_id', userId)
      .single();

    if (!job) {
      throw AppError.notFound('Generation job not found');
    }

    // Create new job
    const { data: newJob } = await supabase
      .from('generation_jobs')
      .insert({
        scene_id: job.scene_id,
        user_id: userId,
        status: 'queued',
        prompt: job.prompt,
        negative_prompt: job.negative_prompt,
        attempts: 0,
      })
      .select()
      .single();

    // Update scene status
    await supabase
      .from('scenes')
      .update({ status: 'generating' })
      .eq('id', job.scene_id);

    res.status(201).json({
      success: true,
      data: newJob,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw AppError.badRequest('Invalid input', error.errors);
    }
    next(error);
  }
});

/**
 * GET /api/generation/:jobId
 * Get generation job status
 */
generationRouter.get('/:jobId', async (req: AuthRequest, res, next) => {
  try {
    const { jobId } = req.params;
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    const { data, error } = await supabase
      .from('generation_jobs')
      .select('*, scenes (projects (user_id))')
      .eq('id', jobId)
      .eq('scenes.projects.user_id', userId)
      .single();

    if (error || !data) {
      throw AppError.notFound('Generation job not found');
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/generation
 * Get all generation jobs for user
 */
generationRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    const { data, error } = await supabase
      .from('generation_jobs')
      .select('*, scenes (*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw AppError.badRequest('Failed to fetch generation jobs');
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    next(error);
  }
});
