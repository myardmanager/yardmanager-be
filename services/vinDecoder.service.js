const axios = require("axios");

const vinDecoder = async (vin) => {
  try {
    const response = await axios.get(
      `https://api.api-ninjas.com/v1/vinlookup?vin=${vin}`,
      {
        headers: {
          "x-api-key": process.env.VIN_API_KEY,
        },
      }
    );
    // const response = { data: { make: "Toyota", model: "Corolla", year: 2019 } };
		// console.log(response.data);
    return {
      make: response.data.manufacturer,
      model: response.data.model,
      year: response.data.year,
			// ...response.data,
    };
  } catch (error) {
    // console.error(error);
    throw error;
  }
};

module.exports = {
  vinDecoder,
};
