const axios = require("axios");

const vinDecoder = async (vin) => {
  try {
    const response = await axios.get(
      // `https://api.api-ninjas.com/v1/vinlookup?vin=JH4KA7561PC008269${vin}`
      `https://api.api-ninjas.com/v1/vinlookup?vin=${vin}`,
      {
        headers: {
          "X-Api-Key": process.env.VIN_API_KEY,
        },
      }
    );
    // const response = { data: { make: "Toyota", model: "Corolla", year: 2019 } };
    return {
      make: response.manufacturer,
      model: response.model,
      year: response.year,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  vinDecoder,
};
