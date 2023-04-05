const { Schema, model } = require("mongoose");

const bcrypt = require("bcryptjs");

const { USER_SUBSCRIPTION_ENUM } = require("../utils");

const userSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, "Set password for user"],
			select: false,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		subscription: {
			type: String,
			enum: USER_SUBSCRIPTION_ENUM,
			default: USER_SUBSCRIPTION_ENUM.STARTER,
		},
		token: {
			type: String,
			default: null,
			select: false,
		},
		avatarURL: {
			type: String,
			default: null,
		},
		verify: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

// // Mongoose custom method for compare password
userSchema.methods.checkPassword = (candidate, hash) =>
	bcrypt.compare(candidate, hash);

const Users = model("Users", userSchema);

module.exports = Users;
