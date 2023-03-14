const cathcAsync = require("../utils/catchAsync");
const {
	Types: { ObjectId },
} = require("mongoose");
const Contacts = require("../schemas/contacts");

const validateId = cathcAsync(async (req, res, next) => {
	const { contactId } = req.params;
	if (!ObjectId.isValid(contactId)) {
		return res.status(400).json({ message: "Invalid id" });
	}
	const contactExists = await Contacts.exists({ _id: contactId });
	if (!contactExists) {
		return res.status(404).json({ message: "Not found contact" });
	}
	next();
});

module.exports = validateId;
