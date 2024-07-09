const { uploadFile } = require("../services/backblaze.service");
const Employee = require("../models/employee.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getAllEmployees = async (req, res) => {
	try {
		const employees = await Employee.find({ company: req.user.company }).populate([
			"role",
			"company"
		]);
		res.status(200).json({
			success: true,
			message: "Employees retrieved successfully",
			data: employees
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.getEmployee = async (req, res) => {
	try {
		const employee = await Employee.findById(req.params.id).populate(["role", "company"]);
		if (!employee) {
			return res.status(404).json({
				success: false,
				message: "Employee not found"
			});
		}
		res.status(200).json({
			success: true,
			message: "Employee retrieved successfully",
			data: employee
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.createEmployee = async (req, res) => {
	try {
		// Created by
		if (req.user.type === "user") req.body.createdByUser = req.user.id;
		if (req.user.type === "employee") req.body.createdByEmployee = req.user.employee;

		// Company
		req.body.company = req.user.company;

		// Encrypt password
		const salt = await bcrypt.genSalt(10);
		req.body.password = await bcrypt.hash(req.body.password, salt);

		// Image upload
		if (req.files && req.files.length > 0) {
			req.body.profile = await uploadFile(req.files[0]);
		}

		const employee = await Employee.create(req.body);
		const newEmployee = await employee.populate(["role", "company"]);
		res.status(201).json({
			success: true,
			message: "Employee created successfully",
			data: newEmployee
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.updateEmployee = async (req, res) => {
	try {
		if (req.files && req.files.length > 0) {
			req.body.profile = await uploadFile(req.files[0]);
		}
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hash(req.body.password, salt);
		}

		const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!employee) {
			return res.status(404).json({
				success: false,
				message: "Employee not found"
			});
		}
		const updatedEmployee = await Employee.findById(req.params.id).populate(["role", "company"]);
		res.status(200).json({
			success: true,
			message: "Employee updated successfully",
			data: updatedEmployee
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.deleteEmployee = async (req, res) => {
	try {
		const employee = await Employee.findOneAndDelete({
			_id: req.params.id,
			company: req.user.company
		});
		if (!employee) {
			return res.status(404).json({
				success: false,
				message: "Employee not found"
			});
		}
		res.status(200).json({
			success: true,
			message: "Employee deleted successfully",
			data: employee
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.paginateEmployees = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const skip = (page - 1) * limit;

		const total = await Employee.countDocuments({ company: req.user.company });
		const employees = await Employee.find({ company: req.user.company })
			.populate("role")
			.skip(skip)
			.limit(limit);

		res.status(200).json({
			success: true,
			meta: {
				total: total,
				page: page,
				limit: limit
			},
			data: employees
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

// exports.login = async (req, res) => {
// 	try {
// 		const employee = await Employee.findOne({ email: req.body.email }).populate("company");
// 		if (!employee) {
// 			return res.status(400).json({
// 				success: false,
// 				message: "Invalid email"
// 			});
// 		}
// 		const isPasswordValid = await bcrypt.compare(req.body.password, employee.password);
// 		if (!isPasswordValid) {
// 			return res.status(400).json({
// 				success: false,
// 				message: "Invalid password"
// 			});
// 		}

// 		const dataSign = {
// 			id: employee._id,
// 			email: employee.email,
// 			type: "user",
// 			company: employee.company._id
// 		};
// 		const token = jwt.sign(dataSign, process.env.JWT_SECRET, { expiresIn: "10h" });

// 		global.userList = global.userList.filter((item) => item.email !== employee.email);
// 		global.userList.push({ token, ...dataSign });

// 		// console.log(global.userList);

// 		res.status(200).json({
// 			success: true,
// 			message: "User logged in successfully",
// 			token: token
// 		});
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 			error: error.message
// 		});
// 	}
// };
