const config = {
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? ""
            : "",
        name: "Starter",
        description: "Perfect for small projects",
        price: 9,
        priceAnchor: 15,
        features: [
          {
            name: "NextJS boilerplate",
          },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw"
            : "price_456",
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        name: "Advanced",
        description: "You need more power",
        price: 149,
        priceAnchor: 299,
        features: [
          {
            name: "NextJS boilerplate",
          },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
          { name: "1 year of updates" },
          { name: "24/7 support" },
        ],
      },
    ],
  },
  mailgun: {
    subdomain: "",
    fromNoReply: ``,
    fromAdmin: ``,
    supportEmail: "",
    forwardRepliesTo: "",
  }
}

export default config;
