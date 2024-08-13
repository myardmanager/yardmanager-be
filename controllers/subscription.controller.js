const {
  subscriptions,
  customers
} = require("../services/stripe");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const companyModel = require("../models/company.model");

exports.subscribeCustomer = async (req, res) => {
  try {
    const { priceId, email, user } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const checkUser = await userModel.findOne({ email: email });
    if (checkUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = await userModel.create({
      user,
      email: email,
      password: hashedPassword,
    });
    let meta = {
      id: newUser._id.toString(),
      email: newUser.email,
    }
    const customer = await customers.createCustomer(email, meta);
    const newSubscription = await subscriptions.subscribeCustomer(customer.id, priceId, email);
    res.status(200).json({ subscription: newSubscription, user: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message, error: error });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptions.getSubscriptions();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const { customerId } = req.params;
    const subscription = await subscriptions.getSubscription(customerId);
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await subscriptions.cancelSubscription(subscriptionId);
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
