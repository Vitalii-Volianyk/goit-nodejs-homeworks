const express = require("express");

const {
	signup,
	login,
	logout,
	getUser,
	updateSubscription,
} = require("../../models/users");

const {
	validateUserData,
	protectPath,
} = require("../../middlewares/middlewares");

const router = express.Router();

router.post("/register", validateUserData, signup);

router.post("/login", validateUserData, login);

router.post("/logout", protectPath, logout);

router.post("/current", protectPath, getUser);

router.patch("/", protectPath, updateSubscription);

module.exports = router;
