const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.listCards = async (customerId) => {
  try {
		console.log(customerId);
    const cards = await stripe.paymentMethods.list({
      type: "card",
			customer: customerId
    });
		console.log(cards);
    return cards;
  } catch (error) {
    throw error;
  }
};

exports.createCard = async (customerId, cardInfo) => {
	try {
		const card = await stripe.customers.createSource(customerId, {
			source: cardInfo.token
		});
		return card;
	} catch (error) {
		throw error;
	}
};

exports.updateCard = async (customerId, cardId, cardInfo) => {
	try {
		const card = await stripe.customers.updateSource(customerId, cardId, cardInfo);
		return card;
	} catch (error) {
		throw error;
	}
};

exports.deleteCard = async (customerId, cardId) => {
	try {
		const deletedCard = await stripe.customers.deleteSource(customerId, cardId);
		return deletedCard;
	} catch (error) {
		throw error;
	}
};
