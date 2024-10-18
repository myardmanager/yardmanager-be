const Part = require("../models/part.model");

// Part CRUD operations
exports.createPart = async (req, res) => {
  try {
    req.body.company = req.user.company;
    const check = await Part.findOne({
      name: { $regex: req.body.name, $options: "i" },
      company: req.user.company,
    });
    if (check) {
      return res.status(400).json({
        success: false,
        message: "Part already exists",
      });
    }

    const lastPart = await Part.findOne({ company: req.user.company }).sort({
      sku: -1,
    });
    if (lastPart) {
      req.body.sku = lastPart.sku + 1;
    } else {
      req.body.sku = 1;
    }

    const part = await Part.create(req.body);
    res.status(201).json({
      success: true,
      message: "Part created successfully",
      data: part,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllParts = async (req, res) => {
  try {
    const parts = await Part.find({ company: req.user.company });
    res.status(200).json({
      success: true,
      message: "Parts fetched successfully",
      data: parts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getPart = async (req, res) => {
  try {
    const part = await Part.findOne({
      _id: req.params.id,
      company: req.user.company,
    });
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }
    res.status(200).json({
      success: true,
      message: "Part fetched successfully",
      data: part,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updatePart = async (req, res) => {
  try {
    const part = await Part.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      req.body,
      { new: true }
    );
    if (!part) {
      return res.status(400).json({
        success: false,
        message: "Part not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Part updated successfully",
      data: part,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deletePart = async (req, res) => {
  try {
    const part = await Part.findOneAndDelete({
      _id: req.params.id,
      company: req.user.company,
    });
    if (!part) {
      return res.status(400).json({
        success: false,
        message: "Part not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Part deleted successfully",
      data: part,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.paginateParts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    let filter = req.query.filter || [];
    if (typeof filter === "string") {
      filter = filter?.split(",");
    } else {
      filter = "";
    }

    const total = await Part.countDocuments({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { variant: { $in: [search] } },
      ],
      company: req.user.company,
      ...(filter.length > 0 ? { variant: { $all: filter } } : {}),
    });

    const parts = await Part.find({
      company: req.user.company,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { variant: { $in: [search] } },
      ],
      ...(filter.length > 0 ? { variant: { $all: filter } } : {}),
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Parts fetched successfully",
      data: parts,
      meta: { total, page, limit },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.searchPartsByName = async (req, res) => {
  try {
    const name = req.query.name;
    const parts = await Part.find({
      name: { $regex: `.*${name}.*`, $options: "i" },
      company: req.user.company,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Parts searched successfully",
      data: parts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
