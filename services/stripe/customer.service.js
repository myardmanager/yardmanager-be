const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCustomer = async (email, meta) => {
  if (!email) {
    throw new Error("Invalid request. 'email' is required.");
  }

  try {
    const existingCustomer = await stripe.customers.list({
      email: email,
      limit: 1,
    });
    if (existingCustomer.data.length > 0) {
      throw new Error(`Customer with email ${req.body.email} already exists.`);
    }
    const customer = await stripe.customers.create({
      email: req.body.email,
      metadata: meta,
    });
    return customer;
  } catch (error) {
    throw new Error(`Failed to create a customer in Stripe: ${error.message}`);
  }
};

exports.getCustomer = async (email) => {
  try {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });
    const customer = customers.data[0];
    return customer;
  } catch (error) {
    throw new Error(`Failed to get customer: ${error.message}`);
  }
};

exports.getCustomers = async () => {
  try {
    const customers = await stripe.customers.list();
    return customers;
  } catch (error) {
    throw new Error(`Failed to get customers: ${error.message}`);
  }
};

exports.deleteCustomer = async (customerId) => {
  try {
    const deletedCustomer = await stripe.customers.del(customerId);
    return deletedCustomer;
  } catch (error) {
    throw new Error(`Failed to delete customer: ${error.message}`);
  }
};

exports.updateCustomer = async (customerId, metadata) => {
  try {
    const updatedCustomer = await stripe.customers.update(customerId, {
      metadata: metadata,
    });
    return updatedCustomer;
  } catch (error) {
    throw new Error(`Failed to update customer: ${error.message}`);
  }
};

exports.paymentMethodsOfCustomers = async (customerIds) => {
  try {
    const paymentMethods = [];
    for (const customerId of customerIds) {
      const methods = await stripe.paymentMethods.list({
        customer: customerId,
      });
      paymentMethods.push(...methods.data);
    }
    return paymentMethods;
  } catch (error) {
    throw new Error(`Failed to get payment methods: ${error.message}`);
  }
};

exports.getCustomerPaymentMethod = async (customerId) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
    });
    return paymentMethods;
  } catch (error) {
    throw new Error(`Failed to get payment methods: ${error.message}`);
  }
};
