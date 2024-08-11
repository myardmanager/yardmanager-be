const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.subscribeCustomer = async (customerId, priceId) => {
  try {
    const [subscription] = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
    });

    if (subscription) {
      throw new Error("Customer already has an active subscription");
    }

    const newSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
      collection_method: "charge_automatically",
      payment_behavior: "default_incomplete",
    });
    return newSubscription;
  } catch (error) {
    throw new Error(`Failed to subscribe customer: ${error.message}`);
  }
};

exports.cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    return subscription;
  } catch (error) {
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
};

exports.getSubscription = async (customerId) => {
  try {
    const subscription = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
    });
    return subscription;
  } catch (error) {
    throw new Error(`Failed to get subscription: ${error.message}`);
  }
};

exports.getSubscriptions = async () => {
  try {
    const subscriptions = await stripe.subscriptions.list({});
    return subscriptions;
  } catch (error) {
    throw new Error(`Failed to get subscriptions: ${error.message}`);
  }
};
