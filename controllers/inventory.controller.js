const Inventory = require("../models/inventory.model");
const partModel = require("../models/part.model");
const Part = require("../models/part.model");
const { uploadFile } = require("../services/backblaze.service");

// Inventory CRUD operations
exports.getInventory = async (req, res) => {
  try {
    if (typeof req.query.deleted === "undefined") req.query.deleted = false;
    const inventory = await Inventory.find({
      company: req.user.company,
      deleted: req.query.deleted,
    }).populate([
      { path: "location", select: "location" },
      { path: "part", select: ["name", "variant"] },
    ]);
    res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    // if (typeof req.query.deleted === "undefined") req.query.deleted = false;
    const inventory = await Inventory.findOne({
      _id: req.params.id,
      company: req.user.company,
      // deleted: req.query.deleted
    }).populate([
      { path: "location", select: "location" },
      { path: "part", select: ["name", "variant"] },
    ]);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.createInventory = async (req, res) => {
  try {
    req.body.company = req.user.company;
    const part = await Part.findById(req.body.part);
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    } else {
      if (!part.color) req.body.color = null;
    }

    if (req.files && req.files.length > 0) {
      req.body.images = [];
      for (let i = 0; i < req.files.length; i++) {
        let image = await uploadFile(req.files[i]);
        req.body.images.push(image);
      }
    }
    // Auto increment SKU
    const lastInventory = await Inventory.findOne({
      company: req.user.company,
    }).sort({ sku: -1 });
    if (lastInventory) {
      req.body.sku = lastInventory.sku + 1;
    } else {
      req.body.sku = 1;
    }
    const inventory = await Inventory.create(req.body);
    const newInventory = await inventory.populate([
      { path: "location" },
      { path: "part" },
    ]);
    res.status(201).json({
      success: true,
      message: "Inventory created successfully",
      data: newInventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    req.body.deleted = false;
    // Check if part exists and color is required
	console.log(req.body)
    const part = await partModel.findOne({
      _id: req.body.part,
      company: req.user.company,
    });
	console.log(part)
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    } else {
      if (!part.color) req.body.color = null;
    }
	if (req.body.images === undefined) req.body.images = []
	if (typeof req.body.images === "string" && req.body.images.length > 0) req.body.images = [req.body.images]
    // Check if images are provided
    // if (!req.body.images) {
    //   let images = await Inventory.findOne({
    //     _id: req.params.id,
    //     company: req.user.company,
    //   }).select("images");
    //   req.body.images = images.images;
    // } else {
    // //   console.log(req.body);
    // //   req.body.images = JSON.parse(req.body.images);
    // //   console.log(req.body);
    // }

    if (req.files && req.files.length > 0) {
      let newImages = [];
      for (let i = 0; i < req.files.length; i++) {
        let image = await uploadFile(req.files[i]);
        newImages.push(image);
      }
      req.body.images = [...req.body.images, ...newImages];
    }

    // Update inventory
    const inventory = await Inventory.findOneAndUpdate(
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

exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findOneAndDelete(
      { _id: req.params.id, company: req.user.company },
      { select: "-company" }
    );
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Inventory deleted successfully",
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

exports.deleteAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.deleteMany({
      company: req.user.company,
      deleted: true,
    });
    res.status(200).json({
      success: true,
      message: "Inventory deleted successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getInventoryPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    // const s_years = req.query.filter_s || "";
    // const e_years = req.query.filter_e || "";

    if (typeof req.query.deleted === "undefined") req.query.deleted = false;
    const inventory = await Inventory.find({
      company: req.user.company,
      deleted: req.query.deleted,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
        { variant: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { make: { $regex: search, $options: "i" } },
      ],
    })
      .populate("part", "name")
      .populate("location", "location")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    const count = await Inventory.countDocuments({
      company: req.user.company,
      deleted: req.query.deleted,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
        { variant: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { make: { $regex: search, $options: "i" } },
      ],
    }).exec();
    res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      data: inventory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.setInventoryDeleteMark = async (req, res) => {
  try {
    const deleted = await Inventory.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      { deleted: req.delete },
      { new: true }
    ).populate([
      { path: "location", select: "location" },
      { path: "part", select: ["name", "variant"] },
    ]);
    res.status(200).json({
      success: true,
      message: `Inventory ${req.delete ? "deleted" : "restored"} successfully`,
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getInventoryByName = async (req, res) => {
  try {
    console.log(req.query.search);
    const inventory = await Inventory.find({
      name: { $regex: req.query.search, $options: "i" },
      company: req.user.company,
    }).populate([
      { path: "location", select: "location" },
      { path: "part", select: ["name", "variant", "color"] },
    ]);
    res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
