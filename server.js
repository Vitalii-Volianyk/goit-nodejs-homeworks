require("dotenv").config({path: "./.env"});
const app = require("./app");
const mongoose = require("mongoose");
const connection = mongoose.connect(
	"mongodb+srv://8UWTFoZh2cJxLQHN:8UWTFoZh2cJxLQHN@hw.bnwh5l0.mongodb.net/?retryWrites=true&w=majority"
);

connection
	.then(() => {
		app.listen(3000, function () {
			console.log(`Server running. Use our API on port: 3000`);
		});
	})
	.catch(err => {
		console.log(`Server not running. Error message: ${err.message}`);
		process.exit(1);
	});
