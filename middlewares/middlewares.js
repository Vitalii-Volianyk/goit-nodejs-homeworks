const {catchAsync} = require("../utils");
const {
	Types: {ObjectId},
} = require("mongoose");
const jwt = require("jsonwebtoken");
const Contacts = require("../schemas/contacts");
const {validateUser} = require("../utils");
const User = require("../schemas/users");

const validateId = catchAsync(async (req, res, next) => {
	const {contactId} = req.params;
	if (!ObjectId.isValid(contactId)) {
		return res.status(400).json({message: "Invalid id"});
	}
	const contact = await Contacts.findById({
		_id: contactId,
		owner: req.user._id,
	});
	if (!contact) {
		return res.status(404).json({
			message: "Not found contact",
		});
	}
	next();
});

const validateUserData = catchAsync(async (req, res, next) => {
	const {error, value} = validateUser(req.body, ["email", "password"]);
	if (error) {
		return res.status(400).json({message: error.message});
	}
	req.body = value;
	next();
});

const protectPath = catchAsync(async (req, res, next) => {
	const {authorization} = req.headers;
	if (!authorization) {
		return res.status(401).json({message: "Not authorized"});
	}
	const token =
		authorization?.startsWith("Bearer") && authorization.split(" ")[1];

	if (!token) {
		return res.status(401).json({message: "Not authorized"});
	}
	const decodedToken = await jwt.verify(
		token,
		"fbdbngdsvgertet43tdgheyrgrgfdhdhd"
	);
	if (!decodedToken) {
		return res.status(401).json({message: "Not authorized"});
	}
	const currentUser = await User.findById(decodedToken.id).select("+token");

	if (!currentUser) return res.status(401).json({message: "Not authorized"});
	if (currentUser.token !== token) {
		return res.status(401).json({
			message: "Not authorized",
		});
	}
	req.user = currentUser;

	next();
});

module.exports = {validateId, validateUserData, protectPath};
