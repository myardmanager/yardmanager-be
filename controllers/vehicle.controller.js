// Vehicle controller

const Vehicle = require("../models/vehicle.model");
const vinDecoder = require("./../services/vinDecoder.service");

exports.getAllVehicles = async (req, res) => {
	try {
		const vehicles = await Vehicle.find({ company: req.user.company });
		res.status(200).json(vehicles);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getVehicle = async (req, res) => {
	const { id } = req.params;
	try {
		const vehicle = await Vehicle.findOne({ _id: id, company: req.user.company });
		res.status(200).json(vehicle);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.createVehicle = async (req, res) => {
	try {
		req.body.company = req.user.company;
		const vehicle = new Vehicle(req.body);
		const newVehicle = await vehicle.save();
		res
			.status(201)
			.json({ success: true, message: "Vehicle created successfully.", data: newVehicle });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateVehicle = async (req, res) => {
	try {
		const { id } = req.params;
		const vehicle = req.body;
		const updatedVehicle = await Vehicle.findOneAndUpdate(
			{ _id: id, company: req.user.company },
			vehicle,
			{ new: true }
		);
		res
			.status(200)
			.json({ success: true, message: "Vehicle updated successfully.", data: updatedVehicle });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.deleteVehicle = async (req, res) => {
	try {
		const { id } = req.params;
		const vehicle = await Vehicle.findOneAndDelete({ _id: id, company: req.user.company });
		res
			.status(200)
			.json({ success: true, message: "Vehicle deleted successfully.", data: vehicle });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.paginateVehicles = async (req, res) => {
	const { page, limit } = req.query;
	const skip = (Number(page) - 1) * Number(limit);
	const search = req.query.search || "";

	try {
		const vehicles = await Vehicle.find({
			company: req.user.company,
			$or: { description: { $regex: search, $options: "i" } }
		})
			.skip(skip)
			.limit(Number(limit));
		const total = await Vehicle.countDocuments();
		res.status(200).json({ vehicles, total });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.searchVehiclesByDescription = async (req, res) => {
	const { query } = req.query;
	try {
		const vehicles = await Vehicle.find({ description: { $regex: query, $options: "i" } });
		res.status(200).json(vehicles);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


exports.decodeVin = async (req, res) => {
	const { vin } = req.query;
	try {
		const vehicle = await vinDecoder(vin);
		res.status(200).json(vehicle);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
