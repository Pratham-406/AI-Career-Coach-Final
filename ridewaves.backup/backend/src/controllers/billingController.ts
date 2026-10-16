import { Request, Response } from 'express';
import { z } from 'zod';
import { mockPricingPlans, mockInvoices } from '../data/mockStore';

export const checkoutSchema = z.object({
  body: z.object({
    planId: z.enum(['free', 'pro', 'campus']),
    billingCycle: z.enum(['monthly', 'annual']).default('monthly'),
  }),
});

export const billingController = {
  getPlans: async (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: mockPricingPlans,
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },

  createCheckoutSession: async (req: Request, res: Response) => {
    const { planId, billingCycle } = req.body;
    const plan = mockPricingPlans.find(p => p.id === planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'NotFoundError',
        message: 'Selected plan not found',
      });
    }

    // In demo mode, we simulate Stripe checkout session creation
    const sessionId = `cs_test_mock_${Date.now()}`;
    const mockCheckoutUrl = `/billing?status=success&session_id=${sessionId}&plan=${planId}&cycle=${billingCycle}`;

    return res.json({
      success: true,
      message: 'Simulated checkout session initiated',
      data: {
        sessionId,
        checkoutUrl: mockCheckoutUrl,
        planName: plan.name,
        amount: billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly,
        currency: 'USD',
        isStripeLive: false,
        notice: 'Payments are in test/placeholder mode for hackathon review. No real credit card charge occurs.',
      },
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },

  getInvoices: async (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: mockInvoices,
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },

  cancelSubscription: async (req: Request, res: Response) => {
    return res.json({
      success: true,
      message: 'Subscription renewal cancelled (Simulated)',
      data: {
        status: 'cancelled',
        effectiveDate: '2026-05-01',
      },
      meta: {
        timestamp: new Date().toISOString(),
        isMockData: true,
      },
    });
  },
};
