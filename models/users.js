const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jimp = require("jimp");
const fs = require("fs").promises;
const { u4 } = require("uuid");
const { catchAsync, sendEmail } = require("../utils");
const { USER_SUBSCRIPTION_ENUM } = require("../utils");
const Users = require("../schemas/users");

// Sign jwt helper function
const signToken = id =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

/**
 *@param {Object} request
 *@param {Object} response
 * @description Signup controller
 */
const signup = catchAsync(async (req, res) => {
	const newUserData = {
		...req.body,
		role: USER_SUBSCRIPTION_ENUM.STARTER,
		avatarURL: gravatar.url(req.body.email, {
			protocol: "https",
			s: "250",
		}),
		verificationToken: u4(),
	};

	const isExist = await Users.findOne({ email: newUserData.email });
	if (isExist) return res.status(409).json({ message: "Email in use" });

	newUserData.password = bcrypt.hashSync(newUserData.password, 10);
	const newUser = await Users.create(newUserData);

	const token = signToken(newUser.id);
	newUser.token = token;
	newUser.save();

	const msg = {
		to: newUser.email,
		from: "goithw@meta.ua",
		subject: "Activate user",
		html: `<p>For verify your email click on link</p><a href="${newUser.verificationToken}" target="blank">${newUser.verificationToken}</>`,
	};
	sendEmail(msg);

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
			avatarURL: newUser.avatarURL,
		},
		token,
	});
});

/**
 *@param {Object} req
 *@param {Object} res
 * @description Login controller
 */
const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	const user = await Users.findOne({ email }).select("+password");

	if (!user)
		return res.status(401).json({ message: "Email or password is wrong" });

	const passwordIsValid = bcrypt.compareSync(password, user.password);

	if (!passwordIsValid)
		return res.status(401).json({ message: "Email or password is wrong" });

	if (!user.verify)
		return res
			.status(400)
			.json({ message: "Verification has not been passed" });

	const token = signToken(user.id);
	user.token = token;
	user.save();
	res.status(200).json({
		user: { email: user.email, subscription: user.subscription },
		token,
	});
});

/**
 *@param {Object} req
 *@param {Object} res
 * @description Logout controller
 */
const logout = catchAsync(async (req, res, next) => {
	const { user: _id } = req;

	const user = await Users.findById(_id).select("+token");

	if (!user) return res.status(401).json({ message: "Not authorized" });

	user.token = null;
	await user.save();

	res.status(204).json({
		message: "No content",
	});
});

/**
 *@param {Object} req
 *@param {Object} res
 * @description Current user controller
 */
const getUser = catchAsync(async (req, res, next) => {
	const { user: _id } = req;

	const user = await Users.findById(_id);

	if (!user) return res.status(401).json({ message: "Not authorized" });

	res.json({
		email: user.email,
		subscription: user.subscription,
	});
});

/**
 *@param {Object} req
 *@param {Object} res
 * @description Avatar upload controller
 */
const apdateUserAvatar = catchAsync(async (req, res, next) => {
	const { user, tmpFile } = req;
	const image = await jimp.read(tmpFile);
	await image.resize(250, 250).quality(90);
	const name = `avatars/user-${Date.now()}.png`;
	await image.writeAsync(`public/${name}`);
	user.avatarURL = name;
	await user.save();
	fs.rm(tmpFile);

	res.status(201).json({
		message: "Avatar uploaded",
	});
});
/**
 *@param {Object} req
 *@param {Object} res
 *@description Update subscription controller
 */
const updateSubscription = catchAsync(async (req, res, next) => {
	const { user: _id } = req;
	const { subscription } = req.body;

	const user = await Users.findById(_id);

	if (!user) return res.status(401).json({ message: "Not authorized" });

	user.subscription = subscription;
	await user.save();

	res.status(202).json({
		email: user.email,
		subscription: user.subscription,
	});
});

const verify = catchAsync(async (req, res, next) => {
	const verificationToken = req.param.verificationToken;
	const user = await Users.findById(verificationToken);

	if (!user) return res.status(404).json({ message: "Not found" });
	user.verificationToken = null;
	user.verify = true;
	await user.save();

	res.json({
		message: "Verification successful",
	});
});

module.exports = {
	signup,
	login,
	logout,
	getUser,
	updateSubscription,
	apdateUserAvatar,
	verify,
};
