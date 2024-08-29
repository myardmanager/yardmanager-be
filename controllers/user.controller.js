const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const { uploadFile } = require("../services/backblaze.service");
const companyModel = require("../models/company.model");
const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employee.model");

// User CRUD operations
exports.register = async (req, res) => {
  try {
    const check = await User.findOne({ email: req.body.user.email });

    if (check) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    req.body.user.password = await bcrypt.hash(req.body.user.password, salt);

    if (req.files) {
      console.log(req.files);
      if (req.files.profile) {
        let profile = await uploadFile(req.files.profile[0]);
        req.body.user.profile = profile;
      } else {
        res.status(400).json({
          success: false,
          message: "Profile image is required",
        });
      }

      if (req.files.cover) {
        let cover = await uploadFile(req.files.cover[0]);
        req.body.company.images = { cover };
      } else {
        res.status(400).json({
          success: false,
          message: "Cover image is required",
        });
      }

      if (req.files.companyImage) {
        let companyImage = await uploadFile(req.files.companyImage[0]);
        req.body.company.images.profile = companyImage;
      } else {
        res.status(400).json({
          success: false,
          message: "Company image is required",
        });
      }
    }

    const user = await User.create(req.body.user);
    req.body.company.owner = user._id;
    const company = await companyModel.create(req.body.company);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user, company },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const company = await companyModel.find({ owner: user._id });
      user = { ...user.toObject(), company: company[0] };
    }
    const employee = await Employee.findOne({ email: req.body.email }).populate(
      ["role", "company"]
    );
    if (!user && !employee) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    let isPasswordValid;
    let dataSign = {};
    let company = {};

    if (user) {
      isPasswordValid = await bcrypt.compare(req.body.password, user.password);
      company = await companyModel.findOne({ owner: user._id });
      dataSign = {
        id: user._id.toString(),
        email: user.email,
        type: "user",
        company: company._id,
      };
    } else {
      isPasswordValid = await bcrypt.compare(
        req.body.password,
        employee.password
      );
      company = employee.company;
      dataSign = {
        id: employee._id.toString(),
        email: employee.email,
        type: "employee",
        company: employee.company._id,
      };
    }
    console.log(company.active, typeof company.active);
    if (!company.active) {
      return res.status(400).json({
        success: false,
        message: "Company is not active",
      });
    }

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(dataSign, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    if (employee) {
      await Employee.findByIdAndUpdate(employee._id, {
        status: true,
        lastLogin: Date.now(),
      });
    } else if (user) {
      await User.findByIdAndUpdate(user._id, {
        lastLogin: Date.now(),
      });
    }
    // global.userList = global.userList.filter((item) => item.id !== dataSign.id);
    // global.userList.push({ token, ...dataSign });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      userType: user ? "user" : "employee",
      data: {
        user: user ? user : employee,
        company,
        token: token,
      },
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const employee = await Employee.findById(req.user.id)
      .select("-password")
      .populate({
        path: "role",
      });
    const company = await companyModel.findById(req.user.company);
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        user: user || employee,
        company,
        type: user ? "user" : "employee",
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

exports.updateInfo = async (req, res) => {
  try {
    // req.body.name = JSON.parse(req.body.name);
    const userId = req.params?.id ? req.params.id : req.user.id
    console.log(req.body);
    const userCheck = await User.findById(userId);
    req.body.email = userCheck.email;
    if (req.files && req.files.length > 0) {
      req.body.profile = await uploadFile(req.files[0]);
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    // if (req.body.password) {
    //   const salt = await bcrypt.genSalt(10);
    //   req.body.password = await bcrypt.hash(req.body.password, salt);
    // }
    req.body.owner = undefined;

    // const employee = await employeeModel.findOne({_id: req.user.id, company: req.user.company});
    // const condition = {}
    const company = await companyModel.findOneAndUpdate(
      { _id: req.user.company },
      req.body,
      { new: true }
    );
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateCompanyImage = async (req, res) => {
  try {
    const companyImages = await companyModel.findById(req.user.company);
    let updateFields = {};

    // console.log(req.files);
    if (req.files?.profile) {
      const profile = await uploadFile(req.files.profile[0]);
      updateFields = {
        ...updateFields,
        profile,
      };
    } else {
      updateFields = {
        ...updateFields,
        profile: companyImages.images.profile,
      };
    }

    if (req.files?.cover) {
      const cover = await uploadFile(req.files.cover[0]);
      updateFields = {
        ...updateFields,
        cover,
      };
    } else {
      updateFields = {
        ...updateFields,
        cover: companyImages.images.cover,
      };
    }

    if (!req.files?.profile && !req.files?.cover) {
      return res.status(400).json({
        success: false,
        message: "At least one image (profile or cover) is required",
      });
    }

    // console.log(updateFields);
    const company = await companyModel.findOneAndUpdate(
      { _id: req.user.company, owner: req.user.id },
      { images: updateFields },
      { new: true }
    );
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Company image updated successfully",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getUserbyEmail = (email) => {
  return User.findOne({ email: email });
};
