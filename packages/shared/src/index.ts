/**
 * Общие типы и схемы для всего проекта Storyboard AI
 */

import { z } from 'zod';

// ===========================================
// USER & AUTH
// ===========================================

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  credits: z.number().int().min(0),
  subscriptionTier: z.enum(['free', 'basic', 'pro', 'enterprise']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// ===========================================
// PROJECTS
// ===========================================

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable(),
  thumbnailUrl: z.string().url().nullable(),
  status: z.enum(['draft', 'processing', 'completed', 'failed']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Project = z.infer<typeof ProjectSchema>;

// ===========================================
// SCENES
// ===========================================

export const SceneSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  sceneNumber: z.number().int().min(1),
  title: z.string().min(1).max(200),
  description: z.string(),
  dialogue: z.string().nullable(),
  characters: z.array(z.string()).default([]),
  location: z.string().nullable(),
  timeOfDay: z.enum(['dawn', 'day', 'dusk', 'night', 'interior']).default('day'),
  cameraAngle: z.enum(['wide', 'medium', 'closeup', 'extreme-closeup', 'over-the-shoulder', 'point-of-view']).default('medium'),
  style: z.enum(['cinematic', 'anime', 'disney', 'pixar', 'noir', 'sketch']).default('cinematic'),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '2.35:1']).default('16:9'),
  imageUrl: z.string().url().nullable(),
  prompt: z.string().nullable(),
  negativePrompt: z.string().nullable(),
  status: z.enum(['pending', 'generating', 'completed', 'failed']).default('pending'),
  metadata: z.record(z.unknown()).nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Scene = z.infer<typeof SceneSchema>;

// ===========================================
// SCRIPT UPLOAD
// ===========================================

export const ScriptSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  filename: z.string(),
  fileType: z.enum(['fdx', 'pdf', 'txt']),
  fileSize: z.number().int().positive(),
  content: z.string().nullable(),
  parsedScenes: z.array(z.unknown()).default([]),
  status: z.enum(['uploaded', 'parsing', 'parsed', 'failed']).default('uploaded'),
  createdAt: z.string().datetime(),
});

export type Script = z.infer<typeof ScriptSchema>;

// ===========================================
// GENERATION JOBS
// ===========================================

export const GenerationJobSchema = z.object({
  id: z.string().uuid(),
  sceneId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(['queued', 'processing', 'completed', 'failed']),
  prompt: z.string(),
  negativePrompt: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  errorMessage: z.string().nullable(),
  attempts: z.number().int().min(0).default(0),
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export type GenerationJob = z.infer<typeof GenerationJobSchema>;

// ===========================================
// SUBSCRIPTIONS
// ===========================================

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  stripeSubscriptionId: z.string().nullable(),
  stripeCustomerId: z.string().nullable(),
  tier: z.enum(['free', 'basic', 'pro', 'enterprise']),
  status: z.enum(['active', 'canceled', 'past_due', 'trialing']),
  currentPeriodStart: z.string().datetime().nullable(),
  currentPeriodEnd: z.string().datetime().nullable(),
  cancelAtPeriodEnd: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

// ===========================================
// CREDIT TRANSACTIONS
// ===========================================

export const CreditTransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().int(),
  type: z.enum(['grant', 'purchase', 'usage', 'refund', 'expiration']),
  description: z.string(),
  balanceAfter: z.number().int(),
  metadata: z.record(z.unknown()).nullable(),
  createdAt: z.string().datetime(),
});

export type CreditTransaction = z.infer<typeof CreditTransactionSchema>;

// ===========================================
// API RESPONSES
// ===========================================

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }).optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1).max(100),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
    }),
  });

// ===========================================
// CONSTANTS
// ===========================================

export const SUBSCRIPTION_TIERS = {
  free: { credits: 10, price: 0, maxProjects: 3, maxScenes: 30 },
  basic: { credits: 100, price: 9.99, maxProjects: 10, maxScenes: 100 },
  pro: { credits: 500, price: 29.99, maxProjects: 50, maxScenes: 500 },
  enterprise: { credits: 2000, price: 99.99, maxProjects: -1, maxScenes: -1 },
} as const;

export const CREDIT_COSTS = {
  generateImage: 1,
  regenerateImage: 1,
  upscaleImage: 2,
  exportPDF: 5,
  exportMP4: 10,
} as const;
