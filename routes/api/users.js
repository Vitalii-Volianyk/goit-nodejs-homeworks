const express = require("express");

const {
	listContacts,
	getContactById,
	addContact,
} = require("../../models/users");

// const validateId = require("../../middlewares/middlewares");

const router = express.Router();

router.post("/register", listContacts);

router.post("/login", addContact);

router.post("/logout", getContactById);

// router.use("/:contactId", validateId);

// router.delete("/:contactId", removeContact);

// router.put("/:contactId", updateContact);

// router.patch("/:contactId/favorite", updateStatusContact);

module.exports = router;
