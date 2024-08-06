const companyModel = require("../models/company.model");
const inventoryModel = require("../models/inventory.model");

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

exports.deleteCompany = async (req, res) => {
  try {
    const company = await companyModel.findOneAndDelete({ _id: req.params.id });
    res.status(201).json({
      success: true,
      message: "Company deleted successfully",
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
