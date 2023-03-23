const Users = require("../schemas/users");

const getAllUsers = async () => {
	return Users.find();
};

const getUsersById = id => {
	return Users.findById(id);
};

const createUsers = newContact => {
	return Users.create(newContact);
};

const updateUsers = (id, fields) => {
	return Users.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeUsers = id => {
	return Users.findByIdAndRemove(id);
};

module.exports = {
	getAllUsers,
	getUsersById,
	createUsers,
	updateUsers,
	removeUsers,
};
