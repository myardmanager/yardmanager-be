const Employee = require("../models/employee.model");
const Inventory = require("../models/inventory.model");
const Part = require("../models/part.model");
const Location = require("../models/location.model");

// Get summary of all employees, inventories, parts, locations
exports.getDashboardAnalytics = async (req, res) => {
	try {
		const employees = await Employee.countDocuments({ company: req.user.company });
		const inventories = await Inventory.countDocuments({ deleted: false });
		const parts = await Part.countDocuments({ company: req.user.company });
		const locations = await Location.countDocuments({ company: req.user.company });

		const analytics = {
			employees: employees,
			inventories: inventories,
			parts: parts,
			locations: locations
		};

		res.status(200).json(analytics);
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Internal server error" });
	}
};


// Get Inventory data ordered by date with filter option
exports.getInventoryData = async (req, res) => {
	try {
		const { division } = req.query;
		let filter = {};
		if (division === "month") {
			filter = { $expr: { $gte: [{ $month: "$createdAt" }, { $month: new Date() }] } };
		} else if (division === "year") {
			filter = { $expr: { $gte: [{ $year: "$createdAt" }, { $year: new Date() }] } };
		} else {
			filter = { $expr: { $gte: [{ $dayOfYear: "$createdAt" }, { $dayOfYear: new Date() }] } };
		}
		const inventory = await Inventory.aggregate([
			{ $match: { company: req.user.company, deleted: false, ...filter } },
			{
				$group: {
					_id: {
						year: { $year: "$createdAt" },
						month: { $month: "$createdAt" },
						day: { $dayOfMonth: "$createdAt" }
					},
					count: { $sum: 1 }
				}
			}
		]);
		res.status(200).json(inventory);
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Internal server error" });
	}
};

