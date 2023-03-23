const Joi = require("joi");

const nameRegex = /^[A-ZА-Я][a-z`-а-я]{2,}[\s][A-ZА-Я][a-z`-а-я]{2,}$/;
const passwordRegex = /^[@!#$%&a-zA-Z\d]{8,}$/;
const phoneRegex =
	/\+?\d{2,3}[-\s(]{0,3}\d{2,3}[-\s)]{0,3}\d{2,3}[-\s]?\d{2,3}[-\s]?\d{2,3}/;
const emailDomain = ["com", "net", "org", "uk"];

const schemaStrict = Joi.object({
	name: Joi.string()
		.trim()
		.min(3)
		.regex(nameRegex)
		.messages({
			"string.pattern.base": `Name may contain only letters, apostrophe, dash and spaces. For example Jacob Mercer.`,
		})
		.required(),
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: emailDomain },
		})
		.required(),
	phone: Joi.string()
		.trim()
		.regex(phoneRegex)
		.messages({
			"string.pattern.base": `Phone number must be digits and can contain spaces, dashes, parentheses and can start with +`,
		})
		.required(),
	favorite: Joi.boolean(),
	owner: Joi.string().min(8).max(240).required(),
});

const schema = Joi.object({
	name: Joi.string().trim().min(3).regex(nameRegex).messages({
		"string.pattern.base": `Name may contain only letters, apostrophe, dash and spaces. For example Jacob Mercer.`,
	}),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: emailDomain },
	}),

	phone: Joi.string().trim().regex(phoneRegex).messages({
		"string.pattern.base": `Phone number must be digits and can contain spaces, dashes, parentheses and can start with +`,
	}),
	favorite: Joi.boolean(),
	owner: Joi.string().min(8).max(240),
});

const dataValidation = (body, strict = true) => {
	if (strict) {
		return schemaStrict.validate(body);
	}
	return schema.validate(body);
};

const validateFavorite = favorite => {
	const schema = Joi.object({
		favorite: Joi.boolean().required(),
	});
	const { error, value } = schema.validate(favorite);
	return { error, value };
};

const validateUser = data => {
	const schema = Joi.object({
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: emailDomain },
			})
			.required(),
		password: Joi.string()
			.trim()
			.min(3)
			.max(300)
			.regex(passwordRegex)
			.messages({
				"string.pattern.base": `Password may contain upper and lower case letters, numbers and one of special characters @!#$%& and minimum 8 characters.`,
			})
			.required(),
	});
	const { error, value } = schema.validate(data);
	return { error, value };
};

module.exports = { dataValidation, validateFavorite, validateUser };
