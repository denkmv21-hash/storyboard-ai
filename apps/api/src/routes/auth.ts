import { Router } from 'express';
import { z } from 'zod';
import { localAuth } from '../lib/local-auth.js';
import { logger } from '../utils/logger.js';

export const authRouter = Router();

// ===========================================
// SCHEMAS
// ===========================================

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ===========================================
// ROUTES
// ===========================================

/**
 * POST /api/auth/signup
 * Register a new user
 */
authRouter.post('/signup', async (req, res) => {
  try {
    const body = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(1).max(100).optional(),
    }).parse(req.body);

    const result = await localAuth.signup(body.email, body.password, body.name);

    logger.info(`New user signed up: ${body.email}`);

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        session: result.session,
        requiresConfirmation: false,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid input');
    }
    throw error;
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
authRouter.post('/login', async (req, res) => {
  try {
    const body = LoginSchema.parse(req.body);
    const result = await localAuth.login(body.email, body.password);

    res.json({
      success: true,
      data: {
        user: result.user,
        session: result.session,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid input');
    }
    throw error;
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
authRouter.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      localAuth.logout(token);
    }

    res.json({
      success: true,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
authRouter.get('/me', async (req, res) => {
  try {
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

    res.json({
      success: true,
      data: { user: session.user },
    });
  } catch (error) {
    throw error;
  }
});
