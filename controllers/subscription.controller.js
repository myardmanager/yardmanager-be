const {
  subscriptions,
  customers,
  invoices,
  cardService,
} = require("../services/stripe");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const companyModel = require("../models/company.model");
const employeeModel = require("../models/employee.model");
const Email = require("../services/email.service");
const { resolve } = require("path");
const { readFileSync } = require("fs");
const template = resolve(__dirname, "../templates/invitation.html");
const html = readFileSync(template, "utf8");

exports.subscribeCustomer = async (req, res) => {
  try {
    const { priceId, user } = req.body;

    let email = user.email;
    const checkEmployee = await employeeModel.findOne({ email: email });
    if (checkEmployee) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }
    let password = user.password;
    let name = user.name;
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
      // name: "Company",
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

    let newHtml = html.replace("{{password}}", password);
    newHtml = newHtml.replace("{{name}}", name);
    await Email.send(email, "Account created successfully", newHtml);
    
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

exports.newCustomerSubscription = async (req, res) => {
  try {
    const { priceId, company } = req.body;
    const companyInfo = await companyModel.findById(company).populate({path: "owner"});
    let email = '';
    if (!companyInfo?.owner) {
      return res.status(400).json({ error: "Company not found" });
    } else {
      email = companyInfo.owner.email
    }
    let customer = await customers.getCustomer(email);
    if (!customer) {
      customer = await customers.createCustomer(email, {
        email: companyInfo.owner.email,
        id: companyInfo.owner._id.toString(),
        name: companyInfo.owner.name.first + ' ' + companyInfo.owner.name.last
      });
    }
    const subscription = await subscriptions.getSubscription(customer.id);
    if (subscription.data.length > 0) {
      return res.status(400).json({ error: "Customer already has an active subscription" });
    }
    const newSubscription = await subscriptions.subscribeCustomer(
      customer.id,
      priceId,
      email
    );
    res.status(200).json({ success: true, message: "Subscription created successfully", subscription: newSubscription });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const { limit = 10, offset } = req.query;
    const subscriptionList = await subscriptions.getSubscriptions(
      limit,
      offset
    );
    for (let i = 0; i < subscriptionList.data.length; i++) {
      const user = await userModel.findOne({ email: subscriptionList.data[i].customer.email });
      subscriptionList.data[i].user = user;
    }
    console.log(subscriptionList.data[0].user);
    res.status(200).json(subscriptionList);
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
    if (req.user.type === "admin") {
      const company = await companyModel.findById(req.user.company).populate({
        path: "owner",
      });
      email = company?.owner?.email;
    } else if (req.user.type === "user") {
      const user = await userModel.findOne({ _id: req.user.id });
      email = user.email;
    } else if (req.user.type === "employee") {
      const employee = await employeeModel
        .findOne({ _id: req.user.id })
        .populate({
          path: "company",
          populate: { path: "owner", select: "email" },
        });
      email = employee.company.owner.email;
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

exports.newCard = async (req, res) => {
  try {
    let email = req.user.email;
    if (req.user.type === "employee") {
      const user = await employeeModel.findById(req.user.id).populate({
        path: "company",
        populate: { path: "owner", select: "email" },
      });
      email = user.company.owner.email;
    }
    const customer = await customers.getCustomer(email);
    const card = await cardService.createCard(customer.id, req.body);
    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    let { id } = req.params;
    let email = req.user.email;
    if (req.user.type === "employee") {
      const user = await employeeModel.findById(req.user.id).populate({
        path: "company",
        populate: { path: "owner", select: "email" },
      });
      email = user.company.owner.email;
    }
    const customer = await customers.getCustomer(email);
    const preCard = await cardService.listCards(customer.id);
    if (preCard.data.length <= 1) {
      return res.status(400).json({ error: "Cannot delete last card" });
    }
    const card = await cardService.deleteCard(id);
    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCards = async (req, res) => {
  try {
    let email = req.user.email;
    if (req.user.type === "employee") {
      const user = await employeeModel.findById(req.user.id).populate({
        path: "company",
        populate: { path: "owner", select: "email" },
      });
      email = user.company.owner.email;
    }
    const customer = await customers.getCustomer(email);
    const cards = await cardService.listCards(customer.id);
    res.status(200).json(cards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await subscriptions.updateSubscription(id, req.body.priceId);
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
