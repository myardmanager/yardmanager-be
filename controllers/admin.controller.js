const bcrypt = require("bcryptjs");
const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/backblaze.service");

exports.register = async (req, res) => {
	try {
		console.log(req.body, "\n", req.files);
		const salt = await bcrypt.genSalt(10);
		req.body.password = await bcrypt.hash(req.body.password, salt);

		if (req.files.length > 0) {
			let profile = await uploadFile(req.files[0]);
			req.body.profile = profile;
		}

		console.log(req.body);

		const admin = await Admin.create(req.body);

		res.status(201).json({
			success: true,
			message: "Admin user created successfully",
			data: admin
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
		const admin = await Admin.findOne({ email: req.body.email });
		if (!admin) {
			return res.status(400).json({
				success: false,
				message: "Invalid email"
			});
		}
		console.log(req.body.password, admin.password);
		const isPasswordValid = await bcrypt.compare(req.body.password, admin.password);
		console.log(isPasswordValid);
		if (!isPasswordValid) {
			return res.status(400).json({
				success: false,
				message: "Invalid password"
			});
		}
		const token = jwt.sign(
			{
				id: admin._id,
				email: admin.email
			},
			process.env.JWT_SECRET,
			{ expiresIn: "10h" }
		);
		res.status(200).json({
			success: true,
			message: "Admin user logged in successfully",
			token: token
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
		const admin = await Admin.findById(req.user.id);
		res.status(200).json({
			success: true,
			message: "Admin user fetched successfully",
			data: admin
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};
