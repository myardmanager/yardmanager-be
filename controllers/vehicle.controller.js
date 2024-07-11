// Vehicle controller

const inventoryModel = require("../models/inventory.model");
const Vehicle = require("../models/vehicle.model");
const { uploadFile } = require("../services/backblaze.service");
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
		if (req.files && req.files.length > 0) {
			for (let i = 0; i < req.files.length; i++) {
				req.body.images = await uploadFile(req.files[0]);
			}
		}
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
		console.log(req.body);
		req.body.deleted = false;
		// Check if images are provided
		if (!req.body.images) {
			let images = await Vehicle.findOne({
				_id: req.params.id,
				company: req.user.company
			}).select("images");
			req.body.images = images.images;
		} else {
			req.body.images = JSON.parse(req.body.images);
		}
		if (req.files && req.files.length > 0) {
			let newImages = [];
			for (let i = 0; i < req.files.length; i++) {
				let image = await uploadFile(req.files[i]);
				newImages.push(image);
			}
			req.body.images = [...req.body.images, ...newImages];
		}

		console.log(req.body);
		// Update inventory
		const inventory = await Vehicle.findOneAndUpdate(
			{ _id: req.params.id, company: req.user.company },
			req.body,
			{ new: true }
		).populate([
			{ path: "location", select: "location" },
			{ path: "part", select: ["name", "variant"] }
		]);
		if (!inventory) {
			return res.status(404).json({
				success: false,
				message: "Inventory not found"
			});
		}

		// Send response
		res.status(200).json({
			success: true,
			message: "Inventory updated successfully",
			data: inventory
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
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
		console.log(search);
		const vehicles = await Vehicle.find({
			company: req.user.company,
			$or: [
				{ name: { $regex: search, $options: "i" } },
				{ make: { $regex: search, $options: "i" } },
				{ model: { $regex: search, $options: "i" } }
			]
		})
			.skip(skip)
			.limit(Number(limit))
			.populate([
				{ path: "location", select: "location" },
				{ path: "part", select: ["name"] }
			]);
		const total = await Vehicle.countDocuments({
			company: req.user.company,
			$or: [
				{ name: { $regex: search, $options: "i" } },
				{ make: { $regex: search, $options: "i" } },
				{ model: { $regex: search, $options: "i" } }
			]
		});
		res.status(200).json({ success: true, data: vehicles, meta: { total, page, limit } });
	} catch (error) {
		res.status(500).json({ message: error.message, errror: error });
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
	const { vin } = req.params;
	try {
		const vehicle = await vinDecoder.vinDecoder(vin);
		return res.status(200).json({ success: true, data: vehicle });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message, error: error });
	}
};

exports.addVehicleToInventory = async (req, res) => {
	const { id } = req.params;
	try {
		const vehicle = await Vehicle.findOne({ _id: id, company: req.user.company });
		if (!vehicle) {
			return res.status(404).json({ success: false, message: "Vehicle not found" });
		}

		const inventory = new inventoryModel({
			part: vehicle._id,
			make,
			model,
			year,
			price: vehicle.price,
			notes: vehicle.notes,
			images: vehicle.images,
			location: vehicle.location,
			company: vehicle.company
		});
		await inventory.save();

		return res.status(200).json({ success: true, message: "Vehicle added to inventory" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
