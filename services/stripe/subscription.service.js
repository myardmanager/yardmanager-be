const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.subscribeCustomer = async (customerId, priceId, email) => {
  try {
    // const [subscription] = await stripe.subscriptions.list({
    //   email: email,
    //   limit: 1,
    // });

    // if (subscription) {
    //   throw new Error("Customer already has an active subscription");
    // }

    let price = null;
    if (priceId === "monthly") {
      price = await stripe.prices.list({
        product: "prod_QcTtPlDs2CImd0",
        limit: 1,
      });
    } else if (priceId === "yearly") {
      price = await stripe.prices.list({
        product: "prod_QeYjdLc6STWYK9",
        limit: 1,
      });
    }
    console.log(price);

    console.log(customerId, email, price.data[0]?.id);
    const newSubscription = await stripe.subscriptions.create({
      customer: customerId,
      // email: email,
      items: [{ price: price.data[0]?.id }],
      expand: ["latest_invoice.payment_intent"],
      collection_method: "charge_automatically",
      payment_behavior: "default_incomplete",
    });
    console.log(newSubscription);

    return newSubscription;
  } catch (error) {
    console.log("\n\nerror");
    console.log(error);
    throw new Error(`Failed to subscribe customer: ${error.message}`);
  }
};

exports.cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
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
      expand: ["data.latest_invoice.payment_intent"],
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
