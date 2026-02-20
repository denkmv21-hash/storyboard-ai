import { Request, Response, NextFunction } from 'express';
import { localAuth } from '../lib/local-auth.js';

export interface AuthRequest extends Request {
  user?: any;
  userId?: string;
}

/**
 * Middleware to protect routes with authentication
 */
export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: { message: 'Missing or invalid authorization header' },
      });
      return;
    }

    const token = authHeader.substring(7);
    const session = localAuth.getSession(token);

    if (!session) {
      res.status(401).json({
        success: false,
        error: { message: 'Invalid or expired token' },
      });
      return;
    }

    // Attach user to request
    req.user = session.user;
    req.userId = session.user.id;

    next();
  } catch (error) {
    next(error);
  }
}
