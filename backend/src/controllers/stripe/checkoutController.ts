import express from 'express';
import { FRONTEND_URL } from '../../config';
import { HttpError, asyncHandler } from '../../utils/http';
import { createCheckout, isStripeConfigured } from './stripe';

const checkoutController = express.Router();

// Plan names the frontend can ask for, mapped to Stripe price ids from the environment
const PLAN_PRICES: Record<string, string | undefined> = {
    freelance: process.env.STRIPE_PRICE_FREELANCE,
    business: process.env.STRIPE_PRICE_BUSINESS,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
};

// POST /api/checkout - body: { plan } or { priceId }, optional mode, successUrl, cancelUrl, email, userId
checkoutController.post('/', asyncHandler(async (req, res) => {
    console.log("stripeService / POST /api/checkout called");
    if (!isStripeConfigured) {
        throw new HttpError(503, "Payments are not configured yet");
    }

    const { plan, mode = 'subscription', email, userId } = req.body;
    const priceId = req.body.priceId || (plan && PLAN_PRICES[String(plan).toLowerCase()]);
    const successUrl = req.body.successUrl || `${FRONTEND_URL}/profile?checkout=success`;
    const cancelUrl = req.body.cancelUrl || `${FRONTEND_URL}/pricing?checkout=cancelled`;

    if (!priceId) {
        throw new HttpError(400, plan ? `No price is configured for the '${plan}' plan` : "A plan or price ID is required");
    }
    if (mode !== 'payment' && mode !== 'subscription') {
        throw new HttpError(400, "Mode must be either 'payment' for one-time payments or 'subscription' for recurring subscription");
    }

    const url = await createCheckout({
        priceId,
        mode,
        successUrl,
        cancelUrl,
        clientReferenceId: userId,
        user: email ? { email } : undefined,
    });
    res.status(201).json({ url });
}));

export default checkoutController;
