const Role = require("../models/role.model");

//ROLES CONTROLLER
exports.getAllRoles = async (req, res) => {
	try {
		const roles = await Role.find({ company: req.user.company });
		res.status(200).json({
			success: true,
			message: "Roles fetched successfully",
			data: roles
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.getRole = async (req, res) => {
	try {
		const role = await Role.findOne({ _id: req.params.id, company: req.user.company });
		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}
		res.status(200).json({
			success: true,
			message: "Role fetched successfully",
			data: role
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.createRole = async (req, res) => {
	try {
		req.body.company = req.user.company;
		const role = await Role.create(req.body);
		res.status(201).json({
			success: true,
			message: "Role created successfully",
			data: role
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.updateRole = async (req, res) => {
	try {
		const role = await Role.findOneAndUpdate(
			{ _id: req.params.id, company: req.user.company },
			req.body,
			{ new: true }
		);
		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}
		res.status(200).json({
			success: true,
			message: "Role updated successfully",
			data: role
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.deleteRole = async (req, res) => {
	try {
		const role = await Role.findOneAndDelete({ _id: req.params.id, company: req.user.company });
		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}
		res.status(200).json({
			success: true,
			message: "Role deleted successfully",
			data: role
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.paginateRoles = async (req, res) => {
	try {
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 10;
		const skip = (page - 1) * limit;

		const total = await Role.countDocuments({ company: req.user.company });
		const roles = await Role.find({ company: req.user.company }).skip(skip).limit(limit);
		res.status(200).json({
			success: true,
			message: "Roles fetched successfully",
			data: roles,
			meta: { total, page, limit }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};
