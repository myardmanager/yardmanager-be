const Role = require("../models/role.model");
const Employee = require("../models/employee.model");

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
		req.body.createdBy = req.user.id;
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
		const count = await Employee.countDocuments({ role: role._id, company: req.user.company });
		res.status(200).json({
			success: true,
			message: "Role updated successfully",
			data: role,
			employeesCount: count
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
		const search = req.query.search || "";
		const filter = req.query.filter || "";

		const total = await Role.countDocuments({
			company: req.user.company,
			name: { $regex: search, $options: "i" }
		});
		const roles = await Role.find({
			company: req.user.company,
			name: { $regex: search, $options: "i" }
		})
			.skip(skip)
			.limit(limit);

		const rolesWithEmployeesCount = await Promise.all(
			roles.map(async (role) => {
				const count = await Employee.countDocuments({ role: role._id, company: req.user.company });
				return { ...role.toObject(), employeesCount: count };
			})
		);

		const rolesWithEmployeeCount = rolesWithEmployeesCount.filter((role) => {
			return role.employeesCount >= filter;
		});
		console.log(rolesWithEmployeeCount);
		res.status(200).json({
			success: true,
			message: "Roles fetched successfully",
			data: rolesWithEmployeeCount,
			meta: { total: rolesWithEmployeeCount.length, page, limit }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.searchRoles = async (req, res) => {
	try {
		const searchQuery = new RegExp(req.query.name, "i");
		const roles = await Role.find({
			company: req.user.company,
			name: searchQuery
		});
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
