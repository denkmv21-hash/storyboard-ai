import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth.js';
import { localAuth } from '../lib/local-auth.js';
import { logger } from '../utils/logger.js';

export const projectsRouter = Router();

// ===========================================
// SCHEMAS
// ===========================================

const CreateProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
});

const UpdateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  thumbnailUrl: z.string().url().optional().nullable(),
  status: z.enum(['draft', 'processing', 'completed', 'failed']).optional(),
});

// In-memory storage for development
const projects: Map<string, any> = new Map();

// ===========================================
// MIDDLEWARE
// ===========================================

// All project routes require authentication
projectsRouter.use((req: AuthRequest, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    res.status(401).json({
      success: false,
      error: { message: 'No token provided' },
    });
    return;
  }

  const session = localAuth.getSession(token);
  
  if (!session) {
    res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' },
    });
    return;
  }

  req.userId = session.user.id;
  next();
});

// ===========================================
// ROUTES
// ===========================================

/**
 * GET /api/projects
 * Get all projects for current user
 */
projectsRouter.get('/', async (req: AuthRequest, res) => {
  const userId = req.userId!;
  
  const userProjects = Array.from(projects.values())
    .filter((p) => p.userId === userId)
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      thumbnailUrl: p.thumbnailUrl,
      status: p.status,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  res.json({
    success: true,
    data: userProjects,
  });
});

/**
 * GET /api/projects/:id
 * Get single project by ID
 */
projectsRouter.get('/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.userId!;
  
  const project = projects.get(id);
  
  if (!project || project.userId !== userId) {
    res.status(404).json({
      success: false,
      error: { message: 'Project not found' },
    });
    return;
  }

  res.json({
    success: true,
    data: {
      id: project.id,
      title: project.title,
      description: project.description,
      thumbnailUrl: project.thumbnailUrl,
      status: project.status,
      created_at: project.createdAt,
      updated_at: project.updatedAt,
      scenes: project.scenes || [],
    },
  });
});

/**
 * POST /api/projects
 * Create new project
 */
projectsRouter.post('/', async (req: AuthRequest, res) => {
  try {
    const body = CreateProjectSchema.parse(req.body);
    const userId = req.userId!;
    
    const project = {
      id: crypto.randomUUID(),
      userId,
      title: body.title,
      description: body.description || null,
      thumbnailUrl: null,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: [],
    };
    
    projects.set(project.id, project);
    
    logger.info(`Project created: ${project.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: {
        id: project.id,
        title: project.title,
        description: project.description,
        thumbnailUrl: project.thumbnailUrl,
        status: project.status,
        created_at: project.createdAt,
        updated_at: project.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid input' },
      });
      return;
    }
    throw error;
  }
});

/**
 * PUT /api/projects/:id
 * Update project
 */
projectsRouter.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const body = UpdateProjectSchema.parse(req.body);
    const userId = req.userId!;
    
    const project = projects.get(id);
    
    if (!project || project.userId !== userId) {
      res.status(404).json({
        success: false,
        error: { message: 'Project not found' },
      });
      return;
    }
    
    const updated = {
      ...project,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    projects.set(id, updated);

    res.json({
      success: true,
      data: {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        thumbnailUrl: updated.thumbnailUrl,
        status: updated.status,
        created_at: updated.createdAt,
        updated_at: updated.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid input' },
      });
      return;
    }
    throw error;
  }
});

/**
 * DELETE /api/projects/:id
 * Delete project
 */
projectsRouter.delete('/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.userId!;
  
  const project = projects.get(id);
  
  if (!project || project.userId !== userId) {
    res.status(404).json({
      success: false,
      error: { message: 'Project not found' },
    });
    return;
  }
  
  projects.delete(id);
  
  logger.info(`Project deleted: ${id} by user ${userId}`);

  res.json({
    success: true,
  });
});
