const Location = require("../models/location.model");

// Location CRUD operations
exports.getAllLocations = async (req, res) => {
	try {
		const locations = await Location.find({ company: req.user.company });
		res.status(200).json({
			success: true,
			message: "Locations fetched successfully",
			data: locations
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.getLocation = async (req, res) => {
	try {
		const location = await Location.findOne(
			{ _id: req.params.id, company: req.user.company },
			{ company: 0 }
		);
		if (!location) {
			return res.status(404).json({ message: "Location not found" });
		}
		res.status(200).json({
			success: true,
			message: "Location fetched successfully",
			data: location
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.createLocation = async (req, res) => {
	try {
		req.body.company = req.user.company;
		const location = await Location.create(req.body);
		res.status(201).json({
			success: true,
			message: "Location created successfully",
			data: location
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.updateLocation = async (req, res) => {
	try {
		const location = req.body.location;
		const newLocation = await Location.findOneAndUpdate(
			{ _id: req.params.id, company: req.user.company },
			{ location },
			{ new: true, select: "-company" }
		);
		if (!newLocation) {
			return res.status(404).json({
				success: false,
				message: "Location not found"
			});
		}
		res.status(200).json({
			success: true,
			message: "Location updated successfully",
			data: newLocation
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.deleteLocation = async (req, res) => {
	try {
		const location = await Location.findOneAndDelete(
			{ _id: req.params.id, company: req.user.company },
			{ select: "-company" }
		);
		if (!location) {
			return res.status(404).json({
				success: false,
				message: "Location not found"
			});
		}
		res.status(200).json({
			success: true,
			message: "Location deleted successfully",
			data: location
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.paginateLocations = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;
		const search = req.query.search || "";

		const total = await Location.countDocuments({
			company: req.user.company,
			location: { $regex: search, $options: "i" }
		});
		const locations = await Location.find({
			company: req.user.company,
			location: { $regex: search, $options: "i" }
		})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		res.status(200).json({
			success: true,
			message: "Locations fetched successfully",
			data: locations,
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

exports.searchLocations = async (req, res) => {
	try {
		const searchString = req.query.name || "";
		const locations = await Location.find({
			company: req.user.company,
			location: { $regex: searchString, $options: "i" }
		})
			.sort({ createdAt: -1 })
			.exec();

		res.status(200).json({
			success: true,
			message: "Locations fetched successfully",
			data: locations
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};
