const cathcAsync = require("../utils/catchAsync");
const {
	Types: { ObjectId },
} = require("mongoose");
const jwt = require("jsonwebtoken");
const Contacts = require("../schemas/contacts");
const { validateUser } = require("../utils");
const User = require("../schemas/users");

const validateId = cathcAsync(async (req, res, next) => {
	const { contactId } = req.params;
	if (!ObjectId.isValid(contactId)) {
		return res.status(400).json({ message: "Invalid id" });
	}
	const contact = await Contacts.findById(contactId);
	if (!contact) {
		return res.status(404).json({
			message: "Not found contact",
		});
	}
	if (contact.owner?.toString() !== req.user._id.toString()) {
		return res.status(401).json({
			message: "No access",
		});
	}
	next();
});

const validateUserData = cathcAsync(async (req, res, next) => {
	const { error, value } = validateUser(req.body);
	if (error) {
		return res.status(400).json({ message: error.message });
	}
	req.body = value;
	next();
});

const protectPath = cathcAsync(async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(401).json({ message: "Not authorized" });
	}
	const token =
		authorization?.startsWith("Bearer") && authorization.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Not authorized" });
	}
	const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
	if (!decodedToken) {
		return res.status(401).json({ message: "Not authorized" });
	}
	const currentUser = await User.findById(decodedToken.id).select("+token");

	if (!currentUser)
		return res.status(401).json({ message: "Not authorized" });
	if (currentUser.token !== token) {
		return res.status(401).json({
			message: "Not authorized",
		});
	}
	req.user = currentUser;

	next();
});

module.exports = { validateId, validateUserData, protectPath };
