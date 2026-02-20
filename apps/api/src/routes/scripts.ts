import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { getSupabaseClient } from '../lib/supabase.js';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const scriptsRouter = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/xml', // FDX files
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, and FDX are allowed.'));
    }
  },
});

// ===========================================
// SCHEMAS
// ===========================================

// ===========================================
// MIDDLEWARE
// ===========================================

scriptsRouter.use(authMiddleware);

// ===========================================
// ROUTES
// ===========================================

/**
 * GET /api/scripts
 * Get all scripts for current user
 */
scriptsRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw AppError.badRequest('Failed to fetch scripts');
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
 * GET /api/scripts/:id
 * Get single script
 */
scriptsRouter.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw AppError.notFound('Script not found');
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
 * POST /api/scripts/upload
 * Upload a script file
 */
scriptsRouter.post('/upload', upload.single('file'), async (req: AuthRequest, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    if (!req.file) {
      throw AppError.badRequest('No file uploaded');
    }

    const fileTypeMap: Record<string, 'fdx' | 'pdf' | 'txt'> = {
      'application/pdf': 'pdf',
      'text/plain': 'txt',
      'application/xml': 'fdx',
    };

    const fileType = fileTypeMap[req.file.mimetype] || 'txt';

    // Upload to Supabase Storage
    const fileName = `${userId}/${Date.now()}_${req.file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('scripts')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) {
      logger.error('Storage upload error:', uploadError);
      throw AppError.badRequest('Failed to upload file');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('scripts')
      .getPublicUrl(uploadData.path);

    // Create script record
    const { data, error } = await supabase
      .from('scripts')
      .insert({
        user_id: userId,
        filename: req.file.originalname,
        file_type: fileType,
        file_size: req.file.size,
        storage_path: uploadData.path,
        status: 'uploaded',
      })
      .select()
      .single();

    if (error) {
      logger.error('Database insert error:', error);
      throw AppError.badRequest('Failed to create script record');
    }

    logger.info(`Script uploaded: ${data.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: {
        ...data,
        url: publicUrl,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw AppError.badRequest('Invalid input', error.errors);
    }
    next(error);
  }
});

/**
 * POST /api/scripts/:id/parse
 * Parse script into scenes
 */
scriptsRouter.post('/:id/parse', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    // Get script
    const { data: script, error: fetchError } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !script) {
      throw AppError.notFound('Script not found');
    }

    // Update status to parsing
    await supabase
      .from('scripts')
      .update({ status: 'parsing' })
      .eq('id', id);

    // TODO: Call AI worker to parse script
    // For now, return placeholder
    res.json({
      success: true,
      data: {
        message: 'Script parsing started',
        scriptId: id,
      },
    });

    logger.info(`Script parsing started: ${id}`);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/scripts/:id
 * Delete script
 */
scriptsRouter.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    // Get script to delete from storage
    const { data: script } = await supabase
      .from('scripts')
      .select('storage_path')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (script?.storage_path) {
      await supabase.storage.from('scripts').remove([script.storage_path]);
    }

    const { error } = await supabase
      .from('scripts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw AppError.badRequest('Failed to delete script');
    }

    logger.info(`Script deleted: ${id}`);

    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
