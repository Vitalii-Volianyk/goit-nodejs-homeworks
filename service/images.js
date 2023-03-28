const multer = require("multer");

const multerStorage = multer.diskStorage({
	destination: (req, file, callBackFunc) => {
		callBackFunc(null, "tmp/");
	},
	filename: (req, file, callBackFunc) => {
		const ext = file.mimetype.split("/")[1];
		const name = `user-${Date.now()}.${ext}`;
		req.tmpFile = `tmp/${name}`;
		callBackFunc(null, name);
	},
});

const multerFilter = (req, file, callBackFunc) => {
	if (file.mimetype.startsWith("image")) {
		callBackFunc(null, true);
	} else {
		callBackFunc(
			new Error("Not an image! Please upload only images."),
			false
		);
	}
};

exports.uploadAvatar = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});
