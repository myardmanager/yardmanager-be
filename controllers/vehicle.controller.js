// Vehicle controller

const { default: mongoose } = require("mongoose");
const inventoryModel = require("../models/inventory.model");
const Vehicle = require("../models/vehicle.model");
const { uploadFile } = require("../services/backblaze.service");
const vinDecoder = require("./../services/vinDecoder.service");
const partModel = require("../models/part.model");

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
    const vehicle = await Vehicle.findOne({
      _id: id,
      company: req.user.company,
    });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    req.body.company = req.user.company;

    if (req.files && req.files.length > 0) {
      req.body.images = [];
      for (let i = 0; i < req.files.length; i++) {
        let image = await uploadFile(req.files[i]);
        req.body.images.push(image);
      }
    }

    const lastVehicle = await Vehicle.findOne({
      company: req.user.company,
    }).sort({ sku: -1 });
    console.log(lastVehicle);
    if (lastVehicle) {
      req.body.sku = lastVehicle.sku + 1;
    } else {
      req.body.sku = 1;
    }

    const part = await partModel.findById(req.body.part);
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }
    if (!part.variant || part.variant.length === 0) {
      const vehicle = new Vehicle({
        ...req.body,
        createdBy: req.user.id,
        createdByType:
          req.user.type.charAt(0).toUpperCase() + req.user.type.slice(1),
      });
      const newVehicle = await vehicle.save();
      res.status(201).json({
        success: true,
        message: "Part created successfully.",
        data: newVehicle,
      });
    } else {
      const variants = part.variant;
      const vehicles = [];

      for (let i = 0; i < variants.length; i++) {
        const vehicle = new Vehicle({
          ...req.body,
          sku: req.body.sku + i,
          variant: variants[i],
          createdBy: req.user.id,
          createdByType:
            req.user.type.charAt(0).toUpperCase() + req.user.type.slice(1),
        });
        vehicles.push(vehicle);
      }

      const newVehicles = await Vehicle.insertMany(vehicles);
      res.status(201).json({
        success: true,
        message: "Part created successfully.",
        data: newVehicles,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    console.log(req.body);
    req.body.deleted = false;
    // req.body.make = JSON.parse(req.body.make);
    // req.body.model = JSON.parse(req.body.model);
    // req.body.variant = JSON.parse(req.body.variant);
    // Check if images are provided
    // if (!req.body.images) {
    //   let images = await Vehicle.findOne({
    //     _id: req.params.id,
    //     company: req.user.company,
    //   }).select("images");
    //   req.body.images = images.images;
    // } else {
    //   // if (req.body.images) {
    //   // 	req.body.images = JSON.parse(JSON.stringify(req.body.images));
    //   // }
    // }
    const part = await partModel.findById(req.body.part);
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    } else {
      if (!part.color) req.body.color = null;
    }

    if (req.body.images === undefined) req.body.images = [];
    if (typeof req.body.images === "string" && req.body.images.length > 0)
      req.body.images = [req.body.images];
    if (req.files && req.files.length > 0) {
      let newImages = [];
      for (let i = 0; i < req.files.length; i++) {
        let image = await uploadFile(req.files[i]);
        newImages.push(image);
      }
      req.body.images = [...req.body.images, ...newImages];
    }

    // console.log(req.body);
    // Update inventory
    const inventory = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      req.body,
      { new: true }
    ).populate([
      { path: "location", select: "location" },
      { path: "part", select: ["name", "variant"] },
    ]);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found",
      });
    }

    // Update all other vehicles with same vin number
    const allVehicles = await Vehicle.updateMany(
      {
        vin: inventory.vin,
        company: req.user.company,
      },
      {
        $set: {
          lastYear: inventory.lastYear,
        },
      }
    );

    const vehiclesPart = await Vehicle.updateMany(
      {
        vin: inventory.vin,
        company: req.user.company,
        "part.color": true,
      },
      {
        $set: {
          color: inventory.color,
        },
      }
    );

    // if (vehiclesPart.length > 0) {
    //   for (let i = 0; i < vehiclesPart.length; i++) {
    //     await Vehicle.findOneAndUpdate(
    //       { _id: vehiclesPart[i].part._id },
    //       { color: inventory.color }
    //     );
    //   }
    // }

    // Send response
    res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findOneAndDelete({
      _id: id,
      company: req.user.company,
    });
    res.status(200).json({
      success: true,
      message: "Part deleted successfully.",
      data: vehicle,
    });
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
        { model: { $regex: search, $options: "i" } },
      ],
    })
      .sort({ sku: 1 })
      .skip(skip)
      .limit(Number(limit))
      .populate([{ path: "location", select: "location" }, { path: "part" }]);
    const total = await Vehicle.countDocuments({
      company: req.user.company,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { make: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ],
    });
    res
      .status(200)
      .json({ success: true, data: vehicles, meta: { total, page, limit } });
  } catch (error) {
    res.status(500).json({ message: error.message, errror: error });
  }
};

exports.searchVehiclesByDescription = async (req, res) => {
  const { query } = req.query;
  try {
    const vehicles = await Vehicle.find({
      description: { $regex: query, $options: "i" },
    });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.decodeVin = async (req, res) => {
  const { vin } = req.params;
  try {
    const vehicle = await vinDecoder.vinDecoder(vin);
    if (!vehicle.make || !vehicle.model || !vehicle.year) {
      return res
        .status(404)
        .json({ success: false, message: "Part not found" });
    }
    return res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, error: error });
  }
};

// exports.addVehicleToInventory = async (req, res) => {
// 	const { id } = req.params;
// 	try {
// 		const vehicle = await Vehicle.findOne({ _id: id, company: req.user.company });
// 		if (!vehicle) {
// 			return res.status(404).json({ success: false, message: "Vehicle not found" });
// 		}

// 		const inventory = new inventoryModel({
// 			part: vehicle._id,
// 			make: vehicle.make,
//       name: vehicle.name,
// 			model: vehicle.model,
// 			start_year: vehicle.start_year,
// 			price: vehicle.price,
// 			notes: vehicle.notes,
// 			images: vehicle.images,
// 			location: vehicle.location,
// 			company: vehicle.company
// 		});
// 		await inventory.save();

// 		return res.status(200).json({ success: true, message: "Vehicle added to inventory" });
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// };

exports.addVehicleToInventory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      company: req.user.company,
    }).session(session);

    if (!vehicle) {
      return res.status(404).json({ message: "Part not found" });
    }

    const lastInventory = await inventoryModel
      .findOne({ company: req.user.company })
      .sort({ sku: -1 });

    if (lastInventory) {
      vehicle.sku = lastInventory.sku + 1;
    } else {
      vehicle.sku = 1;
    }

    const archivedVehicle = new inventoryModel(vehicle.toObject());

    await archivedVehicle.validate();
    await archivedVehicle.save({ session });
    await Vehicle.findByIdAndDelete(req.params.id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Part added to inventory successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.deleteMany({ company: req.user.company });
    res.status(200).json({
      success: true,
      message: "All parts deleted successfully.",
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAllVehiclesToInventory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const vehicles = await Vehicle.find({ company: req.user.company });

    const lastInventory = await inventoryModel
      .findOne({ company: req.user.company })
      .sort({ sku: -1 })
      .session(session);

    let sku = lastInventory ? lastInventory.sku + 1 : 1;

    for (const vehicle of vehicles) {
      try {
        const archivedVehicle = new inventoryModel({
          ...vehicle.toObject(),
          sku,
        });
        await archivedVehicle.validate();
        sku += 1;

        await archivedVehicle.save({ session });
        await Vehicle.findByIdAndDelete(vehicle._id).session(session);
      } catch {
        continue;
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Parts added to inventory successfully.",
    });
  } catch (error) {
    const errorMessages = Object.keys(error.errors).map(
      (key) => error.errors[key].properties.message
    );

    res.status(500).json({
      success: false,
      message: errorMessages.join(", ") ?? error.message,
    });
  }
};
