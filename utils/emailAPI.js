const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailToken = (email, token) => {
	const msg = {
		to: email,
		from: process.env.SENDGRID_FROM_EMAIL,
		subject: "Activate user",
		html: `<p>For verify your email click on link</p> <a href="http://127.0.0.1:3000/api/users/verify/${token}" target="blank">${token}</>`,
	};
	sgMail
		.send(msg)
		.then(() => {
			console.log("Email sent");
		})
		.catch(error => {
			console.error(error);
		});
};

module.exports = sendEmailToken;
