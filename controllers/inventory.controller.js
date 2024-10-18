const { default: mongoose } = require("mongoose");
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
    req.body.createdByType = req.user.type.charAt(0).toUpperCase() + req.user.type.slice(1);
    req.body.createdBy = req.user.id;

    const inventory = await Inventory.create(req.body);
      const newInventory = await inventory.populate([
      { path: "location" },
      { path: "part" },
      { path: "createdBy", select: "name email" },
    ]);
    res.status(201).json({
      success: true,
      message: "Part Successfuly Added", //Part Successfuly Added
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
    console.log(req.body);
    const part = await partModel.findOne({
      _id: req.body.part,
      company: req.user.company,
    });
    console.log(part);
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    } else {
      if (!part.color) req.body.color = null;
    }
    if (req.body.images === undefined) req.body.images = [];
    if (typeof req.body.images === "string" && req.body.images.length > 0)
      req.body.images = [req.body.images];
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
      message: "Part Successfuly Updated",
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
        message: "Part not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Part deleted successfully",
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
      message: "Part deleted successfully",
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
    const { page = 1, limit = 10, deleted = false } = req.query;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    let company = "";
    if (req.user.type == "admin" && req.query.division) {
      company = {
        $lookup: {
          from: "companies", // Assuming the collection name is 'locations'
          localField: "company",
          foreignField: "_id",
          as: "company",
        },
      };
    } else {
      company = {
        $match: { company: new mongoose.Types.ObjectId(req.user.company) },
      };
    }

    if (typeof req.query.deleted === "undefined") req.query.deleted = false;
    // const inventory = await Inventory.find({
    //   ...company,
    //   deleted: req.query.deleted,
    //   $or: [
    //     { name: { $regex: search, $options: "i" } },
    //     { color: { $regex: search, $options: "i" } },
    //     { variant: { $regex: search, $options: "i" } },
    //     { model: { $regex: search, $options: "i" } },
    //     { make: { $regex: search, $options: "i" } },
    //   ],
    // })
    //   .populate({path: "part", select: "name", match: {name: {$regex: search, $options: "i"}}})
    //   .populate("location", "location")
    //   .sort({ createdAt: -1 })
    //   .skip(offset)
    //   .limit(limit)
    //   .exec();

    const pipeline = [
      {
        ...company,
        // $match: {
        // },
      },
      {
        $lookup: {
          from: "parts", // Assuming the collection name is 'parts'
          localField: "part",
          foreignField: "_id",
          as: "part",
        },
      },
      {
        $unwind: { path: "$part", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "locations", // Assuming the collection name is 'locations'
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $unwind: { path: "$location", preserveNullAndEmptyArrays: true },
      },
      {
        $match: {
          deleted: deleted === "true" || deleted === true,
          $or: [
            { "part.name": { $regex: search, $options: "i" } },
            { "location.location": { $regex: search, $options: "i" } },
            // { name: { $regex: search, $options: "i" } },
            { color: { $regex: search, $options: "i" } },
            { variant: { $regex: search, $options: "i" } },
            { model: { $regex: search, $options: "i" } },
            { make: { $regex: search, $options: "i" } },
          ],
        },
      },
    ];

    const inventory = await Inventory.aggregate([
      ...pipeline,
      {
        $sort: { sku: 1 },
      },
      {
        $skip: offset,
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    const count = await Inventory.aggregate([
      ...pipeline,
      {
        $count: "count",
      },
    ]);

    // const count = await Inventory.countDocuments({
    //   // company: req.user.company,
    //   ...company,
    //   deleted: req.query.deleted,
    //   $or: [
    //     { name: { $regex: search, $options: "i" } },
    //     { color: { $regex: search, $options: "i" } },
    //     { variant: { $regex: search, $options: "i" } },
    //     { model: { $regex: search, $options: "i" } },
    //     { make: { $regex: search, $options: "i" } },
    //   ],
    // }).exec();
    res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      data: inventory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count[0]?.count || 0,
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
    let company = {};
    if (req.user.type == "admin" && req.query.division) {
      company = {};
    } else {
      company = { company: req.user.company };
    }
    const deleted = await Inventory.findOneAndUpdate(
      { _id: req.params.id, ...company },
      { deleted: req.delete },
      { new: true }
    ).populate([
      { path: "location", select: "location" },
      { path: "part", select: ["name", "variant"] },
    ]);
    res.status(200).json({
      success: true,
      message: `Part ${req.delete ? "deleted" : "restored"} successfully`,
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
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { sku: parseInt(req.query.search) },
      ],
      company: req.user.company,
      deleted: false,
    }).populate([
      { path: "location", select: "location" },
      { path: "part", select: ["name", "variant", "color"] },
    ]);
    res.status(200).json({
      success: true,
      message: "Part fetched successfully",
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
