const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5001;

// global.userList = [];

// Routes
const adminRoutes = require("./routes/admin.routes");
const roleRoutes = require("./routes/role.routes");
const userRoutes = require("./routes/user.routes");
const locationRoutes = require("./routes/location.routes");
const partRoutes = require("./routes/part.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const employeeRoutes = require("./routes/employee.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const companyRoutes = require("./routes/company.routes");

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.log(error);
	});

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
	res.on("finish", () => {
		const color =
			res.statusCode === 200 ? "\x1b[32m" : res.statusCode === 201 ? "\x1b[36m" : "\x1b[31m";
		const codeStr = `${color}${res.statusCode}\x1b[0m`;
		// const url = req.originalUrl.substring(5);
		var output = [req.method, req.originalUrl, req.ip, req.user?.id, req.user?.role, res.body];
		console.log(codeStr, output.join(" "));
		// if (req.method && req.method !== "GET") {
		// 	const log = logsModel.create({
		// 		action: req.method,
		// 		userId: req.user?.id,
		// 		message: `${req.method} ${url}`,
		// 		role: req.user?.role,
		// 		host: req.hostname
		// 	});
		// }
	});

	next();
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/admin", adminRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/parts", partRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/company", companyRoutes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
