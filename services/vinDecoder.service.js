const axios = require("axios");

const vinDecoder = async (vin) => {
	try {
		// const response = await axios.get(
		// 	`https://vin-decoder19.p.rapidapi.com/vin_decoder_basic?vin=${vin}`
		// );
		const response = { data: { make: "Toyota", model: "Corolla", year: 2019 } };
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

module.exports = {
	vinDecoder
};
