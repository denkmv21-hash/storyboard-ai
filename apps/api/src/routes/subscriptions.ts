import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { getSupabaseClient } from '../lib/supabase.js';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const subscriptionsRouter = Router();

// ===========================================
// SCHEMAS
// ===========================================

// ===========================================
// MIDDLEWARE
// ===========================================

subscriptionsRouter.use(authMiddleware);

// ===========================================
// ROUTES
// ===========================================

/**
 * GET /api/subscriptions/me
 * Get current user's subscription
 */
subscriptionsRouter.get('/me', async (req: AuthRequest, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw AppError.badRequest('Failed to fetch subscription');
    }

    res.json({
      success: true,
      data: data || null,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/subscriptions/checkout
 * Create Stripe checkout session
 */
subscriptionsRouter.post('/checkout', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;

    // TODO: Initialize Stripe
    // For now, return placeholder
    res.json({
      success: true,
      data: {
        sessionId: 'cs_test_placeholder',
        url: 'https://checkout.stripe.com/c/pay/cs_test_placeholder',
      },
    });

    logger.info(`Checkout started for user ${userId}`);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/subscriptions/portal
 * Create Stripe billing portal session
 */
subscriptionsRouter.post('/portal', async (req: AuthRequest, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const userId = req.userId!;

    // Get customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (!subscription?.stripe_customer_id) {
      throw AppError.badRequest('No active subscription found');
    }

    // TODO: Create Stripe portal session
    res.json({
      success: true,
      data: {
        url: 'https://billing.stripe.com/p/session/placeholder',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/subscriptions/webhook
 * Stripe webhook handler (no auth required)
 */
subscriptionsRouter.post('/webhook', (_req, res) => {
  // TODO: Verify webhook signature
  // TODO: Handle webhook events
  res.json({ received: true });
});
