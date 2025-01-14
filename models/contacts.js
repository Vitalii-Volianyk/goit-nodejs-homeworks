const db = require("../service/contacts");
const {catchAsync, dataValidation} = require("../utils");
/**
 *@param {Object} req
 *@param {Object} res
 * @description get all contacts from database
 */
const listContacts = catchAsync(async (req, res, next) => {
	const {_id} = req.user;
	const {favorite, page, limit} = req.query;

	const contacts = await db.getAllContacts(
		favorite
			? {
					owner: _id,
					favorite,
			  }
			: {
					owner: _id,
			  },
		page,
		limit
	);
	if (contacts.length > 0) {
		res.json(contacts);
	} else {
		res.status(404).json({
			message: "Not found contacts",
		});
	}
});

/**
 * @description get contact by id from database
 *@param {Object} req
 *@param {Object} res
 */
const getContactById = catchAsync(async (req, res, next) => {
	const contact = await db.getContactsById(req.params.contactId);

	res.json(contact);
});

/**
 * @description remove contact from database
 *@param {Object} req
 *@param {Object} res
 */
const removeContact = catchAsync(async (req, res, next) => {
	await db.removeContacts(req.params.contactId);
	res.status(204).json();
});

/**
 * @description add new contact to database
 *@param {Object} req
 *@param {Object} res
 */
const addContact = catchAsync(async (req, res, next) => {
	const {error, value} = dataValidation(
		{
			...req.body,
			owner: req.user._id.toString(),
		},
		["name", "email", "phone", "owner"]
	);
	if (error) {
		return res.status(400).json({message: error.message});
	}
	const newContact = await db.createContacts(value);

	res.status(201).json(newContact);
});

/**
 * @description add new contact to database
 *@param {Object} req
 *@param {Object} res
 */
const updateContact = catchAsync(async (req, res, next) => {
	const {error, value} = dataValidation(req.body);
	if (error) {
		return res.status(400).json({message: error.message});
	}
	const updatedContact = await db.updateContacts(req.params.contactId, value);
	res.status(202).json(updatedContact);
});
/**
 * @description update contact favorite field
 *@param {Object} req
 *@param {Object} res
 */
const updateStatusContact = catchAsync(async (req, res, next) => {
	const {error, value} = dataValidation(req.body, ["favorite"]);
	if (error) {
		return res.status(400).json({message: error.message});
	}
	const updatedContact = await db.updateContacts(req.params.contactId, value);
	res.status(202).json({favorite: updatedContact?.favorite});
});

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
	updateStatusContact,
};
