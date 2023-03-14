const express = require("express");

const {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
	updateStatusContact,
} = require("../../models/contacts");
const validateId = require("../../middlewares/middlewares");
const router = express.Router();

router.get("/", listContacts);

router.post("/", addContact);

router.use("/:contactId", validateId);

router.get("/:contactId", getContactById);

router.delete("/:contactId", removeContact);

router.put("/:contactId", updateContact);

router.patch("/:contactId/favorite", updateStatusContact);

module.exports = router;
