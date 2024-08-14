
// services\stripe\invoice.service.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getAllInvoices = async (limit, offset) => {
  try {
    const invoices = await stripe.invoices.list({
      limit: limit,
      offset: offset,
    });
    return invoices;
  } catch (error) {
    throw new Error(`Failed to get all invoices: ${error.message}`);
  }
};

exports.getInvoice = async (customer) => {
  try {
    const invoice = await stripe.invoices.list({
      customer: customer,
      limit: 1,
    });
    return invoice;
  } catch (error) {
    throw new Error(`Failed to get invoice: ${error.message}`);
  }
};

exports.createInvoice = async (customerId, params) => {
  try {
    const invoice = await stripe.invoices.create({
      customer: customerId,
      ...params,
    });
    return invoice;
  } catch (error) {
    throw new Error(`Failed to create invoice: ${error.message}`);
  }
};

exports.payInvoice = async (invoiceId) => {
  try {
    const invoice = await stripe.invoices.pay(invoiceId);
    return invoice;
  } catch (error) {
    throw new Error(`Failed to pay invoice: ${error.message}`);
  }
};

exports.updateInvoice = async (invoiceId, params) => {
  try {
    const invoice = await stripe.invoices.update(invoiceId, params);
    return invoice;
  } catch (error) {
    throw new Error(`Failed to update invoice: ${error.message}`);
  }
};

exports.deleteInvoice = async (invoiceId) => {
  try {
    const deletedInvoice = await stripe.invoices.del(invoiceId);
    return deletedInvoice;
  } catch (error) {
    throw new Error(`Failed to delete invoice: ${error.message}`);
  }
};

exports.sendInvoice = async (invoiceId) => {
  try {
    const invoice = await stripe.invoices.sendInvoice(invoiceId);
    return invoice;
  } catch (error) {
    throw new Error(`Failed to send invoice: ${error.message}`);
  }
};

exports.markUncollectible = async (invoiceId) => {
  try {
    const invoice = await stripe.invoices.markUncollectible(invoiceId);
    return invoice;
  } catch (error) {
    throw new Error(`Failed to mark invoice as uncollectible: ${error.message}`);
  }
};

exports.listAllInvoiceLines = async (invoiceId) => {
  try {
    const lines = await stripe.invoiceItems.list({
      invoice: invoiceId,
    });
    return lines;
  } catch (error) {
    throw new Error(`Failed to list all invoice lines: ${error.message}`);
  }
};

exports.retrieveInvoiceLine = async (invoiceLineId) => {
  try {
    const line = await stripe.invoiceItems.retrieve(invoiceLineId);
    return line;
  } catch (error) {
    throw new Error(`Failed to retrieve invoice line: ${error.message}`);
  }
};

exports.createInvoiceLine = async (invoiceId, params) => {
  try {
    const line = await stripe.invoiceItems.create({
      invoice: invoiceId,
      ...params,
    });
    return line;
  } catch (error) {
    throw new Error(`Failed to create invoice line: ${error.message}`);
  }
};

exports.updateInvoiceLine = async (invoiceLineId, params) => {
  try {
    const line = await stripe.invoiceItems.update(invoiceLineId, params);
    return line;
  } catch (error) {
    throw new Error(`Failed to update invoice line: ${error.message}`);
  }
};

exports.deleteInvoiceLine = async (invoiceLineId) => {
  try {
    const deletedLine = await stripe.invoiceItems.del(invoiceLineId);
    return deletedLine;
  } catch (error) {
    throw new Error(`Failed to delete invoice line: ${error.message}`);
  }
};
