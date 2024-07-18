const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const Email = require("../services/email.service");
const otpModel = require("../models/otp.model");
const bcrypt = require("bcryptjs");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const template = resolve(__dirname, "../templates/otp.html");
const html = readFileSync(template, "utf8");

exports.sendOtp = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		const employee = await Employee.findOne({ email });

		if (!user && !employee) {
			return res.status(404).json({ message: "User not found" });
		}

		const otp = Math.floor(1000 + Math.random() * 9000);
		const lastOtp = await otpModel.findOne({ email }).sort({ createdAt: -1 });
		if (lastOtp && lastOtp.createdAt > Date.now() - 2 * 60 * 1000) {
			return res.status(400).json({ message: "OTP sent recently, please wait for some time" });
		}
		await otpModel.create({ email, otp });

		const templateParams = {
			to_email: email,
			otp
		};

		console.log(templateParams);
		let newHtml = html.replace("{{otp}}", otp);
		newHtml = newHtml.replace(
			"{{name}}",
			user ? user.name.first + " " + user.name.last : employee.name.first + " " + employee.name.last
		);

		try {
			const response = await Email.send(email, "OTP", newHtml);
			console.log(response);
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error.message,
				error: error
			});
		}

		res.status(200).json({
			success: true,
			message: "OTP sent successfully"
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

const jwt = require("jsonwebtoken");

exports.verifyOtp = async (req, res) => {
	try {
		const { email, otp } = req.body;
		const otpRecord = await otpModel.findOne({ email });
		if (!otpRecord) {
			return res.status(404).json({ message: "OTP not found" });
		}
		console.log(typeof otpRecord.otp, otpRecord.otp, typeof otp, otp);
		if (otpRecord.otp === otp) {
			await otpRecord.deleteOne();
			const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });
			res.status(200).json({
				success: true,
				message: "OTP verified successfully.",
				data: token
			});
		} else {
			res.status(400).json({
				success: false,
				message: "Invalid OTP"
			});
		}
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
		let user = await User.findById(req.user.id);
		if (!user) {
			user = await Employee.findById(req.user.id);
		}
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		user.password = await bcrypt.hash(req.body.password, 10);
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
