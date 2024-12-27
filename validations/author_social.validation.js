const Joi = require("joi");

exports.authorSocialValidation = (data) => {
  const authorSocialSchema = Joi.object({
    author_id: Joi.string()
      .alphanum()
      .message("Author ID noto'g'ri")
      .required(),
    social_id: Joi.string()
      .alphanum()
      .message("Social ID noto'g'ri")
      .required(),
    social_link: Joi.string()
      .required()
      .trim()
      .messages({
        "string.empty": "Social link bo'sh bo'lishi mumkin emas!",
        "any.required": "Social link kiritilishi shart!"
      })
  });

  return authorSocialSchema.validate(data, { abortEarly: false });
}; 