const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../schemas/users");
const { USER_SUBSCRIPTION_ENUM } = require("../utils");
const { catchAsync } = require("../utils");

// Sign jwt helper function
const signToken = id =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

/**
 *@param {Object} req
 *@param {Object} res
 * @description Signup controller
 */
const signup = catchAsync(async (req, res) => {
	const newUserData = {
		...req.body,
		role: USER_SUBSCRIPTION_ENUM.STARTER,
	};

	const isExist = await Users.findOne({ email: newUserData.email });
	if (isExist) return res.status(409).json({ message: "Email in use" });

	newUserData.password = bcrypt.hashSync(newUserData.password, 10);
	const newUser = await Users.create(newUserData);

	const token = signToken(newUser.id);
	newUser.token = token;
	newUser.save();

	res.status(201).json({
		user: { email: newUser.email, subscription: newUser.subscription },
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

module.exports = {
	signup,
	login,
	logout,
	getUser,
	updateSubscription,
};
