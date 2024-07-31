const userModel = require("../models/role.model");
const companyModel = require("../models/company.model");

const checkRole = ({ companyId = false }) => {
  return async (req, res, next) => {
    const role = req.user.type;
    console.time("role");
    console.log("Checking role ", role);
    if (role === "admin") {
      console.log("admin");
      if (companyId) {
        if (!req.query.company || req.query.company.length !== 24) {
          return res
            .status(403)
            .json({ success: false, message: "Company is required." });
        }
        const company = await companyModel.findById(req.query.company);
        if (!company) {
          return res
            .status(404)
            .json({ success: false, message: "Company not found." });
        }
        req.user.company = company._id;
      }
      next();
    } else if (role === "user" || role === "employee") {
      console.log("user or employee");
      next();
    }
    console.timeEnd("role");
    console.log("done with checking role");
  };
};

module.exports = checkRole;
