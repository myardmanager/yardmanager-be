const Employee = require("../models/employee.model");
const Inventory = require("../models/inventory.model");
const Part = require("../models/part.model");
const Location = require("../models/location.model");
const { default: mongoose } = require("mongoose");

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
			filter = { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } };
		} else if (division === "year") {
			filter = { createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } };
		} else {
			filter = { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) } };
		}
    let companyId = new mongoose.Types.ObjectId(req.user.company);
		const inventory = await Inventory.find({ company: companyId, deleted: false, ...filter })
			.sort({ createdAt: 1 })
			.then((inventory) => {
				const data = inventory.map((item) => {
					return {
						year: item.createdAt.getFullYear(),
						month: item.createdAt.getMonth() + 1,
						day: item.createdAt.getDate(),
						count: 1
					};
				});
				return data;
			});

		// const inventory = await Inventory.find({
		// 	company: req.user.company,
		// 	deleted: false,
		// }).sort({ createdAt: 1 });

		// const inventory = await Inventory.aggregate([
		// 	{
		// 		$match: { company: companyId, deleted: false }
		// 	},
		// 	{
		// 		$group: {
		// 			_id: {
		// 				year: { $year: "$createdAt" },
		// 				month: { $month: "$createdAt" },
		// 				day: { $dayOfMonth: "$createdAt" }
		// 			},
		// 			count: { $sum: 1 }
		// 		}
		// 	}
		// ]).exec();
		// .group({ $project: { _id: 0, createdAt: 1 } });

		console.log(inventory);
		res.status(200).json(inventory);
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Internal server error" });
	}
};
