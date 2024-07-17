const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY);

const send = async (to, subject, template) => {

	const msg = {
		to: to, // Change to your recipient
		from: "no-reply@aiautoparts.net", // Change to your verified sender
		subject: subject,
		// text: "and easy to do anywhere, even with Node.js",
		html: template
	};
	try {
		const response = await sgMail.send(msg);
    console.log(response[0].statusCode);
    return response[0].statusCode;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

exports.send = send;
