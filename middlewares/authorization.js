const jwt = require("jsonwebtoken");
// const roles = require("../config/roles");
// const { logMiddleware } = require("./log");

exports.verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);

		req.user = user;
		// logMiddleware(req, res);
		next();
	});
};

exports.verifyRole = (role) => {
	return (req, res, next) => {
		console.log(req.user.role, roles[req.user.role]);
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
