const companyModel = require("../models/company.model");
const employeeModel = require("../models/employee.model");
const inventoryModel = require("../models/inventory.model");
const locationModel = require("../models/location.model");
const roleModel = require("../models/role.model");
const userModel = require("../models/user.model");
const vehicleModel = require("../models/vehicle.model");

// Company CRUD operations
exports.createCompany = async (req, res) => {
  try {
    req.body.owner = req.user.id;
    const company = await companyModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await companyModel
      .findOne({ _id: req.params.id })
      .populate("owner");
    res.status(201).json({
      success: true,
      message: "Company retrieved successfully",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await companyModel
      .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .populate("owner");
    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// exports.deleteCompany = async (req, res) => {
//   try {
//     const company = await companyModel.findOneAndDelete({ _id: req.params.id });
//     res.status(201).json({
//       success: true,
//       message: "Company deleted successfully",
//       data: company,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

exports.deleteCompany = async (req, res) => {
  try {
    // const user = await userModel.findOne({ _id: req.params.id });
    const company = await companyModel.findOneAndDelete({ _id: req.params.id });
    const user = await userModel.findOne({ _id: company.owner });
    const inventory = await inventoryModel.deleteMany({
      company: req.params.id,
    });
    const location = await locationModel.deleteMany({
      company: req.params.id,
    });
    const invoice = await invoiceModel.deleteMany({
      company: req.params.id,
    });
    const employees = await employeeModel.deleteMany({
      company: req.params.id,
    });
    const roles = roleModel.deleteMany({
      company: req.params.id,
    });
    const vehicle = await vehicleModel.deleteMany({
      company: req.params.id,
    });

    res.status(201).json({
      success: true,
      message: "User and company permanently deleted successfully",
      result: {company, user, inventory, location, invoice, employees, roles, vehicle},
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await companyModel.find({}).populate("owner");
    res.status(201).json({
      success: true,
      message: "Companies retrieved successfully",
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.pagination = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;
    const companies = await companyModel
      .find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      })
      .populate("owner")
      .skip(offset)
      .limit(limit);

    const result = await Promise.all(
      companies.map(async (company) => {
        const countInventory = await inventoryModel
          .countDocuments({ company: company._id })
          .exec();
        console.log(countInventory);
        return { ...company.toObject(), countInventory };
      })
    );

    console.log(result);
    const total = await companyModel.countDocuments({});
    res.status(201).json({
      success: true,
      message: "Companies retrieved successfully",
      data: result,
      meta: { total, page, limit },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};
