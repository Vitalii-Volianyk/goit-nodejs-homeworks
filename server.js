require("dotenv").config({ path: "./.env" });
const app = require("./app");
const mongoose = require("mongoose");
const connection = mongoose.connect(
	process.env.MONGO_URL || "mongodb://localhost:27017/contacts"
);

const { sendEmail } = require("./utils");

const msg = {
	to: "vitaliu12445@gmail.com",
	from: "goithw@meta.ua",
	subject: "Activate user",
	text: "Test",
};

connection
	.then(() => {
		app.listen(process.env.PORT, function () {
			console.log(
				`Server running. Use our API on port: ${process.env.PORT}`
			);
			sendEmail(msg);
		});
	})
	.catch(err => {
		console.log(`Server not running. Error message: ${err.message}`);
		process.exit(1);
	});
