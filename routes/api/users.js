const express = require("express");

const {
	signup,
	login,
	logout,
	getUser,
	updateSubscription,
	apdateUserAvatar,
	verify,
	reVerify,
} = require("../../models/users");
const { uploadAvatar } = require("../../service/images");

const {
	validateUserData,
	protectPath,
} = require("../../middlewares/middlewares");

const router = express.Router();

router.get("/verify/:verificationToken", verify);

router.post("/verify", reVerify);

router.post("/register", validateUserData, signup);

router.post("/login", validateUserData, login);

router.post("/logout", protectPath, logout);

router.post("/current", protectPath, getUser);

router.patch(
	"/avatars",
	protectPath,
	uploadAvatar.single("avatar"),
	apdateUserAvatar
);

router.patch("/", protectPath, updateSubscription);

module.exports = router;
