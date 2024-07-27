const userModel = require("../models/role.model")

const checkRole = (roles) => {
  return (req, res, next) => {
    const { role, id } = req.user;
    if (role === "admin") {
      next();
    } else if (role === "user" || role === "employee") {
      if (roles === role) {
        next();
      } else {}
    }
  };
};

module.exports = checkRole
