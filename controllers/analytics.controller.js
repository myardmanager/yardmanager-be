const Employee = require("../models/employee.model");
const Inventory = require("../models/inventory.model");
const Part = require("../models/part.model");
const Vehicle = require("../models/vehicle.model");
const Location = require("../models/location.model");
const { default: mongoose } = require("mongoose");
const companyModel = require("../models/company.model");
const inventoryModel = require("../models/inventory.model");
const employeeModel = require("../models/employee.model");
const userModel = require("../models/user.model");
const { getCountSubscriptions } = require("../services/stripe/subscription.service");

exports.getDashboardAnalytics = async (req, res) => {
  try {
    let company = "";
    let countsSubscriptions = null;
    if (req.user.type === "admin" && req.query.division === "company") {
      company = {};
      countsSubscriptions = await getCountSubscriptions();
    } else {
      company = { company: req.user.company };
    }
    const employees = await Employee.countDocuments(company);
    const inventories = await Inventory.countDocuments({
      ...company,
      deleted: false,
    });
    const vehicles = await Vehicle.countDocuments(company);
    const parts = await Part.countDocuments(company);
    const locations = await Location.countDocuments(company);
    let yards = null;
    if (req.user.type === "admin" && req.query.division === "company") {
      yards = await companyModel.countDocuments({});
    }

    const analytics = {
      employees: employees,
      inventories: inventories,
      parts: parts,
      vehicles: vehicles,
      locations: locations,
      yards: yards || undefined,
      subscriptions: countsSubscriptions,
    };

    res.status(200).json(analytics);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;

  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Get Inventory data ordered by date with filter option
exports.getVehicleData = async (req, res) => {
  try {
    // let companyId = new mongoose.Types.ObjectId(req.user.company);
    let companyId = "";
    if (req.user.type === "admin" && req.query.division === "company") {
      companyId = {};
    } else {
      companyId = { company: new mongoose.Types.ObjectId(req.user.company) };
    }
    const inventory = await Vehicle.find(companyId)
      .sort({ createdAt: 1 })
      .then((inventory) => {
        const data = inventory.map((item) => {
          return {
            year: item.createdAt.getFullYear(),
            month: item.createdAt.getMonth() + 1,
            day: item.createdAt.getDate(),
            week: getWeekNumber(item.createdAt),
            count: 1,
          };
        });
        return data;
      });

    console.log(inventory);
    res.status(200).json(inventory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getPartData = async (req, res) => {
  try {
    let companyId = "";
    if (req.user.type === "admin" && req.query.division === "company") {
      companyId = {};
    } else {
      companyId = { company: new mongoose.Types.ObjectId(req.user.company) };
    }
    const part = await Part.find(companyId)
      .sort({ createdAt: 1 })
      .then((part) => {
        const data = part.map((item) => {
          return {
            year: item.createdAt.getFullYear(),
            month: item.createdAt.getMonth() + 1,
            day: item.createdAt.getDate(),
            week: getWeekNumber(item.createdAt),
            count: 1,
          };
        });
        return data;
      });
    res.status(200).json(part);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getInventoryData = async (req, res) => {
  try {
    // let companyId = new mongoose.Types.ObjectId(req.user.company);
    let companyId = "";
    if (req.user.type === "admin" && req.query.division === "company") {
      companyId = {};
    } else {
      companyId = { company: new mongoose.Types.ObjectId(req.user.company) };
    }
    const inventory = await inventoryModel
      .find({...companyId, deleted: false})
      .sort({ createdAt: 1 })
      .then((inventory) => {
        const data = inventory.map((item) => {
          return {
            year: item.createdAt.getFullYear(),
            month: item.createdAt.getMonth() + 1,
            day: item.createdAt.getDate(),
            week: getWeekNumber(item.createdAt),
            count: 1,
          };
        });
        return data;
      });

    console.log(inventory);
    res.status(200).json(inventory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    if (req.user.type !== "admin") {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }
    const user = await userModel.find({})
      .sort({ createdAt: 1 })
      .then((usr) => {
        const data = usr.map((item) => {
          return {
            year: item.createdAt.getFullYear(),
            month: item.createdAt.getMonth() + 1,
            day: item.createdAt.getDate(),
            week: getWeekNumber(item.createdAt),
            count: 1,
          };
        });
        return data;
      });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};
