const companyModel = require("../models/company.model");

// Company CRUD operations
exports.createCompany = async (req, res) => {
	try {
		req.body.owner = req.user.id;
		const company = await companyModel.create(req.body);
		res.status(201).json({
			success: true,
			message: "Company created successfully",
			data: company
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.getCompany = async (req, res) => {
	try {
		const company = await companyModel.findOne({ _id: req.params.id });
		res.status(201).json({
			success: true,
			message: "Company retrieved successfully",
			data: company
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.updateCompany = async (req, res) => {
	try {
		const company = await companyModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
		res.status(201).json({
			success: true,
			message: "Company updated successfully",
			data: company
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.deleteCompany = async (req, res) => {
	try {
		const company = await companyModel.findOneAndDelete({ _id: req.params.id });
		res.status(201).json({
			success: true,
			message: "Company deleted successfully",
			data: company
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.getAllCompanies = async (req, res) => {
	try {
		const companies = await companyModel.find();
		res.status(201).json({
			success: true,
			message: "Companies retrieved successfully",
			data: companies
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};
