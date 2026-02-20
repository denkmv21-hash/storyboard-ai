import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { getSupabaseClient } from '../lib/supabase.js';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const scenesRouter = Router();

// ===========================================
// SCHEMAS
// ===========================================

const CreateSceneSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string(),
  dialogue: z.string().optional().nullable(),
  characters: z.array(z.string()).default([]),
  location: z.string().optional().nullable(),
  timeOfDay: z.enum(['dawn', 'day', 'dusk', 'night', 'interior']).default('day'),
  cameraAngle: z.enum(['wide', 'medium', 'closeup', 'extreme-closeup', 'over-the-shoulder', 'point-of-view']).default('medium'),
  style: z.enum(['cinematic', 'anime', 'disney', 'pixar', 'noir', 'sketch']).default('cinematic'),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '2.35:1']).default('16:9'),
});

const UpdateSceneSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  dialogue: z.string().optional().nullable(),
  characters: z.array(z.string()).optional(),
  location: z.string().optional().nullable(),
  timeOfDay: z.enum(['dawn', 'day', 'dusk', 'night', 'interior']).optional(),
  cameraAngle: z.enum(['wide', 'medium', 'closeup', 'extreme-closeup', 'over-the-shoulder', 'point-of-view']).optional(),
  style: z.enum(['cinematic', 'anime', 'disney', 'pixar', 'noir', 'sketch']).optional(),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '2.35:1']).optional(),
  imageUrl: z.string().url().optional().nullable(),
  prompt: z.string().optional().nullable(),
  negativePrompt: z.string().optional().nullable(),
  status: z.enum(['pending', 'generating', 'completed', 'failed']).optional(),
});

// ===========================================
// MIDDLEWARE
// ===========================================

scenesRouter.use(authMiddleware);

// ===========================================
// ROUTES
// ===========================================

/**
 * GET /api/scenes/project/:projectId
 * Get all scenes for a project
 */
scenesRouter.get('/project/:projectId', async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.params;
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (!project) {
      throw AppError.notFound('Project not found');
    }

    const { data, error } = await supabase
      .from('scenes')
      .select('*')
      .eq('project_id', projectId)
      .order('scene_number', { ascending: true });

    if (error) {
      throw AppError.badRequest('Failed to fetch scenes');
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/scenes/:id
 * Get single scene
 */
scenesRouter.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    const { data, error } = await supabase
      .from('scenes')
      .select('*, projects (user_id)')
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single();

    if (error || !data) {
      throw AppError.notFound('Scene not found');
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
 * POST /api/scenes
 * Create new scene
 */
scenesRouter.post('/', async (req: AuthRequest, res, next) => {
  try {
    const body = CreateSceneSchema.parse(req.body);
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', body.projectId)
      .eq('user_id', userId)
      .single();

    if (!project) {
      throw AppError.notFound('Project not found');
    }

    // Get max scene number
    const { data: maxScene } = await supabase
      .from('scenes')
      .select('scene_number')
      .eq('project_id', body.projectId)
      .order('scene_number', { ascending: false })
      .limit(1)
      .single();

    const sceneNumber = (maxScene?.scene_number || 0) + 1;

    const { data, error } = await supabase
      .from('scenes')
      .insert({
        project_id: body.projectId,
        scene_number: sceneNumber,
        title: body.title,
        description: body.description,
        dialogue: body.dialogue,
        characters: body.characters,
        location: body.location,
        time_of_day: body.timeOfDay,
        camera_angle: body.cameraAngle,
        style: body.style,
        aspect_ratio: body.aspectRatio,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating scene:', error);
      throw AppError.badRequest('Failed to create scene');
    }

    logger.info(`Scene created: ${data.id} in project ${body.projectId}`);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw AppError.badRequest('Invalid input', error.errors);
    }
    next(error);
  }
});

/**
 * PUT /api/scenes/:id
 * Update scene
 */
scenesRouter.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const body = UpdateSceneSchema.parse(req.body);
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    // Verify ownership through project
    const { data: scene } = await supabase
      .from('scenes')
      .select('id, projects (user_id)')
      .eq('id', id)
      .eq('projects.user_id', userId)
      .single();

    if (!scene) {
      throw AppError.notFound('Scene not found');
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      ...body,
    };

    const { data, error } = await supabase
      .from('scenes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating scene:', error);
      throw AppError.badRequest('Failed to update scene');
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw AppError.badRequest('Invalid input', error.errors);
    }
    next(error);
  }
});

/**
 * DELETE /api/scenes/:id
 * Delete scene
 */
scenesRouter.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    const { error } = await supabase
      .from('scenes')
      .delete()
      .eq('id', id)
      .eq('projects.user_id', userId);

    if (error) {
      throw AppError.badRequest('Failed to delete scene');
    }

    logger.info(`Scene deleted: ${id}`);

    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
