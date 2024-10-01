const Invoice = require("../models/invoice.model");

// Invoice CRUD operations

exports.createInvoice = async (req, res) => {
	try {
		if (req.user.type === "user") req.body.soldByUser = req.user.id;
		if (req.user.type === "employee") req.body.soldByEmployee = req.user.id;
		if (req.user.type === "admin") req.body.soldByAdmin = req.user.id;
		req.body.company = req.user.company;
		if (req.body.products.length === 0) {
			return res.status(400).json({ message: "No products found" });
		}
		const total = req.body.products.reduce(
			(sum, product) => sum + product.price * product.quantity,
			0
		);
		const tax = (total * req.body.tax) / 100;
		req.body.status = req.body.paid === total + tax ? true : false;
		const invoice = await Invoice.create(req.body);
		const newInvoice = await invoice.populate(["soldByUser", "soldByEmployee"]);
		res.status(201).json({
			success: true,
			message: "Invoice created successfully",
			data: newInvoice
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.getInvoice = async (req, res) => {
	try {
		const invoice = await Invoice.findOne({
			_id: req.params.id,
			company: req.user.company
		}).populate(["soldByUser", "soldByEmployee", "products.product"]);
		if (!invoice) {
			return res.status(404).json({ message: "Invoice not found" });
		}
		res.status(200).json({
			success: true,
			message: "Invoice fetched successfully",
			data: invoice
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.getAllInvoices = async (req, res) => {
	try {
		const invoices = await Invoice.find({ company: req.user.company }).populate([
			"soldByUser",
			"soldByEmployee",
			"products.product"
		]);
		res.status(200).json({
			success: true,
			message: "Invoices fetched successfully",
			data: invoices
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.updateInvoice = async (req, res) => {
	try {
		if (req.body.products.length === 0) {
			return res.status(400).json({ message: "No products found" });
		}
		const total = req.body.products.reduce(
			(sum, product) => sum + product.price * product.quantity,
			0
		);
		const tax = (total * req.body.tax) / 100;
		req.body.status = req.body.paid === total + tax ? true : false;
		const invoice = await Invoice.findOneAndUpdate(
			{ _id: req.params.id, company: req.user.company },
			req.body,
			{ new: true }
		);
		if (!invoice) {
			return res.status(400).json({
				success: false,
				message: "Invoice not found"
			});
		}
		res.status(200).json({
			success: true,
			message: "Invoice updated successfully",
			data: invoice
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.deleteInvoice = async (req, res) => {
	try {
		const invoice = await Invoice.findOneAndDelete({
			_id: req.params.id,
			company: req.user.company
		});
		if (!invoice) {
			return res.status(400).json({
				success: false,
				message: "Invoice not found"
			});
		}
		res.status(200).json({
			success: true,
			message: "Invoice deleted successfully",
			data: invoice
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

exports.paginateInvoices = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;
		const search = req.query.search || "";

		const invoices = await Invoice.find({
			company: req.user.company,
			$or: [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
				{ phone: { $regex: search, $options: "i" } },
				//asds
				// { _id: search },
			]
		})
			.skip(skip)
			.limit(limit)
			.populate(["soldByUser", "soldByEmployee", {path: "products.product", populate: "part"}]);
		const total = await Invoice.countDocuments({
			company: req.user.company,
			$or: [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
				{ phone: { $regex: search, $options: "i" } }
			]
		});
		res.status(200).json({
			success: true,
			message: "Invoices fetched successfully",
			data: invoices,
			meta: {
				total,
				page,
				limit: limit
			}
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};
