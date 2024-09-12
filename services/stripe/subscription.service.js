const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const moment = require("moment");

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

    // const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // const updateSubscription = await stripe.subscriptions.update(subscriptionId, {
    //   items: [{
    //     id: subscription.items.data[0].id,
    //     price: price.data[0].id
    //   }],
    //   cancel_at_period_end: false,
    //   expand: ["latest_invoice.payment_intent"],
    //   // collection_method: "charge_automatically",
    //   proration_behavior: 'create_prorations',
    //   payment_behavior: "default_incomplete",
    // });
    // return updateSubscription;

    // Retrieve the current subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Get the current subscription item and plan details
    const currentItem = subscription.items.data[0];
    // const currentPriceId = currentItem.price.id;

    // Get the current billing period (start and end dates)
    const currentPeriodEnd = subscription.current_period_end; // Unix timestamp
    const currentPeriodStart = subscription.current_period_start; // Unix timestamp

    // Calculate the remaining days in the current period
    const currentTime = moment().unix();
    const remainingDays =
      (currentPeriodEnd - currentTime) /
      (currentPeriodEnd - currentPeriodStart);

    // Calculate the prorated amount of unused time on the current monthly plan
    const monthlyAmount = currentItem.price.unit_amount;
    const proratedAmount = remainingDays * monthlyAmount;

    // Switch to the new yearly price and apply the prorated credit
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: currentItem.id, // Keep the same subscription item
            price: price, // Update to yearly plan
          },
        ],
        cancel_at_period_end: false,
        proration_behavior: "create_prorations", // Automatically prorates the remaining amount
        // Apply the prorated credit by adding it to the current invoice's discount
        invoice_settings: {
          custom_fields: [
            {
              name: "Prorated Credit",
              value: `${(proratedAmount / 100).toFixed(
                2
              )} USD applied as credit`,
            },
          ],
        },
        expand: ["latest_invoice.payment_intent"],
      }
    );

    return updatedSubscription;
  } catch (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
};

exports.cancelSubscription = async (subscriptionId) => {
  try {
    // const subscription = await stripe.subscriptions.cancel(subscriptionId);
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
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

exports.getSubscriptions = async (limit = 10, offset = 1, search = null) => {
  try {
    let subscriptionsList = [];
    let has_more = true;

    while (has_more) {
      const subscriptions = await stripe.subscriptions.list({
        limit: 100,
      });
      subscriptionsList.push(...subscriptions.data);
      has_more = subscriptions[subscriptions.length - 1]?.has_more;
    }
    const checkOffset =
      subscriptionsList.length > (offset - 1) * limit - 1
        ? (offset - 1) * limit - 1
        : subscriptionsList.length - 1;
    const start_after = subscriptionsList[checkOffset]?.id;
    console.log(checkOffset, "\n ", start_after, "\n\n");
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

exports.getCountSubscriptions = async () => {
  try {
    let count = 0;
    let subscriptions = await stripe.subscriptions.list({
      limit: 100,
    });
    count += subscriptions.data.length;
    while (subscriptions.data[subscriptions.data.length - 1]?.has_more) {
      const lastId = subscriptions.data[subscriptions.data.length - 1].id;
      subscriptions = await stripe.subscriptions.list({
        limit: 100,
        starting_after: lastId,
      });
      count += subscriptions.data.length;
    }

    return count;
  } catch (error) {
    throw new Error(`Failed to get subscriptions: ${error.message}`);
  }
};
