import { Router } from 'express';
import { authRouter } from './auth.js';
import { projectsRouter } from './projects.js';
import { scenesRouter } from './scenes.js';
import { scriptsRouter } from './scripts.js';
import { subscriptionsRouter } from './subscriptions.js';
import { generationRouter } from './generation.js';

export const routes = Router();

// Public routes
routes.use('/auth', authRouter);

// Protected routes (auth check will be added to each router)
routes.use('/projects', projectsRouter);
routes.use('/scenes', scenesRouter);
routes.use('/scripts', scriptsRouter);
routes.use('/subscriptions', subscriptionsRouter);
routes.use('/generation', generationRouter);
