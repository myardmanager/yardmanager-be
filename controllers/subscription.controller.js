const { subscribeCustomer, getSubscriptions, getSubscription, cancelSubscription } = require("../services/stripe/subscription.service");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const companyModel = require("../models/company.model");

exports.subscribeCustomer = async (req, res) => {
  try {
    const { customerId, priceId, email, user } = req.body;

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
    })
    const newSubscription = await subscribeCustomer(customerId, priceId, email);
    res.status(200).json(newSubscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await getSubscriptions();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const { customerId } = req.params;
    const subscription = await getSubscription(customerId);
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await cancelSubscription(subscriptionId);
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
