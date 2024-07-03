const Role = require("../models/role.model");

//ROLES CONTROLLER
exports.getAllRoles = async (req, res) => {
	try {
		const roles = await Role.find({});
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
		const role = await Role.findById(req.params.id);
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
		const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
			new: true
		});
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
		const role = await Role.findByIdAndDelete(req.params.id);
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
