const jwt = require("jsonwebtoken");
// const roles = require("../config/roles");
// const { logMiddleware } = require("./log");

exports.verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) return res.status(401).json({ success: false, message: "No token provided" });

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ success: false, message: "Token expired" });

		req.user = user;
		// logMiddleware(req, res);

		// const userCheck = global.userList.find((item) => item.id === req.user.id);
		next();
		return;
		// if (token === userCheck?.token) {
		// }

		// return res
		// 	.status(403)
		// 	.json({ success: false, message: "New Login session occurs", result: req.user.email });
		// next();
	});
};

exports.verifyRole = (role) => {
	return (req, res, next) => {
		// console.log(req.user.role, roles[req.user.role]);
		// logMiddleware(req, res, next);
		// if (req.user && roles[req.user.role] >= roles[role]) {
		if (req.user.role === "superadmin") {
			next();
		} else if (req.user && role.includes(req.user.role)) {
			next();
		} else {
			return res.status(403).json({ message: "Insufficient permissions", result: req.user });
		}
	};
};
