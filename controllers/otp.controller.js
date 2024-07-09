const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const emailjs = require("emailjs-com");
const otpModel = require("../models/otp.model");

exports.sendOtp = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		const employee = await Employee.findOne({ email });

		if (!user && !employee) {
			return res.status(404).json({ message: "User not found" });
		}

		const otp = Math.floor(100000 + Math.random() * 900000);
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
		// try {
		// 	const response = await emailjs.send("service_7yv83gy", "template_3st7v4i", templateParams, "kprpF991QyeJ4uPlv");
		// 	console.log(response.statusCode);
		// 	console.log(response.body);
		// } catch (error) {
		// 	console.log(error);
		// }

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

exports.verifyOtp = async (req, res) => {
	try {
		const { email, otp } = req.body;
		const otpRecord = await otpModel.findOne({ email });
		if (!otpRecord) {
			return res.status(404).json({ message: "OTP not found" });
		}
		if (otpRecord.otp === otp) {
			await otpRecord.remove();
			res.status(200).json({
				success: true,
				message: "OTP verified successfully"
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
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const isPasswordValid = await bcrypt.compare(req.body.oldPassword, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({
				success: false,
				message: "Old password is incorrect"
			});
		}
		user.password = await bcrypt.hash(req.body.newPassword, 10);
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
