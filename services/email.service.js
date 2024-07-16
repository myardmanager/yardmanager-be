// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const { readFileSync } = require("fs");
const { resolve } = require("path");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const template = resolve(__dirname, "../New folder/otp.html");
const html = readFileSync(template, "utf8");

const send = async () => {
  // console.log(html);
  let newHtml = html.replace("{{otp}}", 1234);
	// console.log(newHtml);

	const msg = {
		to: "tmashaim@gmail.com", // Change to your recipient
		from: "no-reply@aiautoparts.net", // Change to your verified sender
		subject: "OTP",
		// text: "and easy to do anywhere, even with Node.js",
		html: newHtml
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
