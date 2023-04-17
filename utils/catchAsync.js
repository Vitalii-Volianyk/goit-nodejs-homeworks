const catchAsync = fn => (req, res, next) => {
	fn(req, res, next).catch(error => next(error));
};

const asyncWrapper = controller => {
	return (req, res, next) => {
		controller(req, res).catch(next);
	};
};

module.exports = {
	catchAsync,
};
