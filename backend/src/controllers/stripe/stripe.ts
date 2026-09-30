import Stripe from "stripe";
import '../../config';

interface CreateCheckoutParams {
  priceId: string;
  mode: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  couponId?: string | null;
  clientReferenceId?: string;
  user?: {
    customerId?: string;
    email?: string;
  };
}

interface CreateCustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const isStripeConfigured = Boolean(stripeSecretKey);

let stripeClient: Stripe | undefined;
function getStripe() {
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  stripeClient ??= new Stripe(stripeSecretKey, {
    apiVersion: "2024-04-10",
    typescript: true,
  });
  return stripeClient;
}

export const createCheckout = async ({
  user,
  mode,
  clientReferenceId,
  successUrl,
  cancelUrl,
  priceId,
  couponId,
}: CreateCheckoutParams): Promise<string> => {
  const stripe = getStripe();

  const extraParams: {
    customer?: string;
    customer_creation?: "always";
    customer_email?: string;
    invoice_creation?: { enabled: boolean };
    payment_intent_data?: { setup_future_usage: "on_session" };
    tax_id_collection?: { enabled: boolean };
  } = {};

  if (user?.customerId) {
    extraParams.customer = user.customerId;
  } else {
    if (mode === "payment") {
      extraParams.customer_creation = "always";
      // The option below costs 0.4% (up to $2) per invoice.
      // extraParams.invoice_creation = { enabled: true };
      extraParams.payment_intent_data = { setup_future_usage: "on_session" };
    }
    if (user?.email) {
      extraParams.customer_email = user.email;
    }
    extraParams.tax_id_collection = { enabled: true };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode,
    // Stripe accepts either a fixed coupon or user-entered promotion codes, not both
    ...(couponId ? { discounts: [{ coupon: couponId }] } : { allow_promotion_codes: true }),
    client_reference_id: clientReferenceId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...extraParams,
  });

  if (!stripeSession.url) {
    throw new Error("Stripe did not return a checkout URL");
  }
  return stripeSession.url;
};

// This is used to create Customer Portal sessions, so users can manage their subscriptions (payment methods, cancel, etc..)
export const createCustomerPortal = async ({
  customerId,
  returnUrl,
}: CreateCustomerPortalParams): Promise<string> => {
  const stripe = getStripe();

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return portalSession.url;
};

// This is used to get the uesr checkout session and populate the data so we get the planId the user subscribed to
export const findCheckoutSession = async (sessionId: string) => {
  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};
