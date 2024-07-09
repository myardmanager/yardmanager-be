const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const { uploadFile } = require("../services/backblaze.service");
const companyModel = require("../models/company.model");
const jwt = require("jsonwebtoken");

// User CRUD operations
exports.register = async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		// console.log(req.body);
		// console.log(req.body.user.password);
		req.body.user.password = await bcrypt.hash(req.body.user.password, salt);

		if (req.files) {
			console.log(req.files);
			if (req.files.profile) {
				let profile = await uploadFile(req.files.profile[0]);
				req.body.user.images = { profile };
			} else {
				res.status(400).json({
					success: false,
					message: "Profile image is required"
				});
			}

			if (req.files.cover) {
				let cover = await uploadFile(req.files.cover[0]);
				req.body.user.images.cover = cover;
			} else {
				res.status(400).json({
					success: false,
					message: "Cover image is required"
				});
			}

			if (req.files.companyImage) {
				let companyImage = await uploadFile(req.files.companyImage[0]);
				req.body.company.image = companyImage;
			} else {
				res.status(400).json({
					success: false,
					message: "Company image is required"
				});
			}
		}

		const user = await User.create(req.body.user);
		req.body.company.owner = user._id;
		const company = await companyModel.create(req.body.company);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			data: { user, company }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.login = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		const employee = await Employee.findOne({ email: req.body.email }).populate(["role"]);
		if (!user && !employee) {
			return res.status(400).json({
				success: false,
				message: "Invalid email"
			});
		}
		let isPasswordValid;
		let dataSign = {};

		if (user) {
			isPasswordValid = await bcrypt.compare(req.body.password, user.password);
			const company = await companyModel.find({ owner: user._id });
			dataSign = {
				id: user._id.toString(),
				email: user.email,
				type: "user",
				company: company[0]._id
			};
		} else {
			isPasswordValid = await bcrypt.compare(req.body.password, employee.password);
			dataSign = {
				id: employee._id.toString(),
				email: employee.email,
				type: "employee",
				company: employee.company._id
			};
		}

		if (!isPasswordValid) {
			return res.status(400).json({
				success: false,
				message: "Invalid password"
			});
		}

		const token = jwt.sign(dataSign, process.env.JWT_SECRET, { expiresIn: "10h" });

		global.userList = global.userList.filter((item) => item.id !== dataSign.id);
		global.userList.push({ token, ...dataSign });

		res.status(200).json({
			success: true,
			message: "User logged in successfully",
			userType: user ? "user" : "employee",
			data: {
				user: user ? user : employee,
				token: token
			}
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.getInfo = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		const employee = await Employee.findById(req.user.id).select("-password").populate({
			path: "role"
		});
		const company = await companyModel.findById(req.user.company);
		res.status(200).json({
			success: true,
			message: "User fetched successfully",
			data: { user: user || employee, company, type: user ? "user" : "employee" }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.updateInfo = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.user.id, req.body, {
			new: true
		});
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found"
			});
		}
		res.status(200).json({
			success: true,
			message: "User updated successfully",
			data: user
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.user.id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found"
			});
		}
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
			data: user
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json({
			success: true,
			message: "Users fetched successfully",
			data: users
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json({
			success: true,
			message: "User fetched successfully",
			data: user
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.changePassword = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(req.body.password, salt);
		await user.save();
		res.status(200).json({
			success: true,
			message: "Password changed successfully"
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};
