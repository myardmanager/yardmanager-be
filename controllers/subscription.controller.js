const { subscriptions, customers, invoices } = require("../services/stripe");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const companyModel = require("../models/company.model");
const employeeModel = require("../models/employee.model");

exports.subscribeCustomer = async (req, res) => {
  try {
    const { priceId, user } = req.body;

    let email = user.email;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const checkUser = await userModel.findOne({ email: email });
    if (checkUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }
    const newUser = await userModel.create({
      ...user,
      password: hashedPassword,
    });
    const newCompany = await companyModel.create({
      ...user.company,
      name: "Company",
      phone: "123456789",
      address: "Company Address",
      owner: newUser._id,
    });
    let meta = {
      id: newUser._id.toString(),
      email: newUser.email,
    };
    const customer = await customers.createCustomer(email, meta);
    const newSubscription = await subscriptions.subscribeCustomer(
      customer.id,
      priceId,
      email
    );
    res
      .status(200)
      .json({ success: true, subscription: newSubscription, user: newUser });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: error.message, error: error });
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
    const { plan } = req.params;
    // const user = req.user;
    let email = "";
    if (!req.user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (req.user.type === "user") {
      const user = await userModel.findOne({ _id: req.user.id });
      email = user.email;
      console.log(email);
    } else if (req.user.type === "employee") {
      const employee = await employeeModel
        .findOne({ _id: req.user.id })
        .populate({
          path: "company",
          populate: { path: "owner", select: "email" },
        });
      email = employee.company.owner.email;
      console.log(employee);
    }
    console.log("\n\n", email);
    const customer = await customers.getCustomer(email);
    console.log(customer);
    if (!customer) {
      return res.status(400).json({ error: "Customer not found" });
    }
    let subscription = await subscriptions.getSubscription(customer.id);
    console.log(subscription);
    let id = subscription.data[0]?.id;
    if (!id && plan) {
      subscription = await subscriptions.subscribeCustomer(
        customer.id,
        plan,
        email
      );
    } else if (id && plan) {
      console.log(id, plan);
      subscription = await subscriptions.updateSubscription(id, plan);
    }

    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await subscriptions.cancelSubscription(id);
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    let email = req.user.email;
    if (req.user.type === "employee") {
      const user = await employeeModel.findById(req.user.id).populate({
        path: "company",
        populate: { path: "owner", select: "email" },
      });
      email = user.company.owner.email;
    }
    if (!email) {
      return res.status(400).json({ error: "User not found" });
    }
    const customer = await customers.getCustomer(email);
    console.log(customer);
    const invoiceList = await invoices.getInvoice();
    console.log(invoiceList);
    res.status(200).json({ success: true, result: invoiceList });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
