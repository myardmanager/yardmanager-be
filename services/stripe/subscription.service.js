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

exports.updateSubscription = async (subscriptionId, priceId) => {
  try {
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
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{ price: price.data[0]?.id }],
      expand: ["latest_invoice.payment_intent"],
      collection_method: "charge_automatically",
      payment_behavior: "default_incomplete",
    });
    return subscription;
  } catch (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  } 
};

exports.cancelSubscription = async (subscriptionId) => {
  try {
    // const subscription = await stripe.subscriptions.cancel(subscriptionId);
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
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

exports.getSubscriptions = async (limit = 10, offset = 1) => {
  try {
    let subscriptionsList = []
    let has_more = true

    while (has_more) {
      const subscriptions = await stripe.subscriptions.list({
        limit: 100,
      })
      subscriptionsList.push(...subscriptions.data)
      has_more = subscriptions[subscriptions.length - 1]?.has_more
    }
    const checkOffset = subscriptionsList.length > (offset - 1) * limit - 1 ? (offset - 1) * limit - 1 : subscriptionsList.length - 1
    const start_after = subscriptionsList[checkOffset]?.id;
    console.log(checkOffset, '\n ', start_after, '\n\n');
    for (let i = 0; i < subscriptionsList.length; i++) {
      console.log(subscriptionsList[i].id);
    }
    
    const subscriptions = await stripe.subscriptions.list({
      limit: limit,
      starting_after: start_after,
      expand: ["data.customer"],
    });
    return subscriptions;
  } catch (error) {
    throw new Error(`Failed to get subscriptions: ${error.message}`);
  }
};
