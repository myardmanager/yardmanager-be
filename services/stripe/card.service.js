const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.listCards = async (customerId) => {
  try {
    console.log(customerId);
    const cards = await stripe.customers.listPaymentMethods(customerId);
    console.log(cards);
    return cards;
  } catch (error) {
    throw error;
  }
};

exports.createCard = async (customerId, cardInfo) => {
  try {
    const card = await stripe.paymentMethods.create({
      type: "card",
      card: {
				number: cardInfo.number,
				exp_month: cardInfo.exp_month,
				exp_year: cardInfo.exp_year,
				cvc: cardInfo.cvc,
			},
    });
    console.log(card);
    const link = await stripe.paymentMethods.attach(card.id, {
      customer: customerId,
    });
		console.log(link);
    return link;
  } catch (error) {
    throw error;
  }
};

exports.updateCard = async (customerId, cardId, cardInfo) => {
  try {
    const card = await stripe.customers.updateSource(
      customerId,
      cardId,
      cardInfo
    );
    return card;
  } catch (error) {
    throw error;
  }
};

exports.deleteCard = async (cardId) => {
  try {
    const deletedCard = await stripe.paymentMethods.detach(cardId);
    return deletedCard;
  } catch (error) {
    throw error;
  }
};
