import express from 'express';
import { createCheckout } from './stripe';

const checkoutController = express.Router();

// POST /api/create-checkout-session
checkoutController.post('/', async (req, res) => {
    console.log("stripeService / POST /api/create-checkout-session called");
    const { priceId, mode, successUrl, cancelUrl } = req.body;

    if (!priceId) {
        return res.status(400).json({ error: "Price ID is required" });
    } else if (!successUrl ||!cancelUrl) {
        return res.status(400).json({ error: "Success and cancel URLs are required" });
    } else if (!mode) {
        return res.status(400).json({
            error: "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)"
        });
    }

    try {
        const session = await createCheckout({
            priceId,
            mode,
            successUrl,
            cancelUrl,
            // Assuming you want to store the user ID in the session metadata
            //metadata: { userId: req.user?.id },
        });

        //res.status(201).json({ url: session.url });
    } catch (error) {
        console.error(error);
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
});

export default checkoutController;
