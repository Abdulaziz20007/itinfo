const Joi = require("joi");

exports.socialValidation = (data) => {
  const socialSchema = Joi.object({
    social_name: Joi.string()
      .required()
      .trim()
      .messages({
        "string.empty": "Social name bo'sh bo'lishi mumkin emas!",
        "any.required": "Social name kiritilishi shart!"
      }),
    social_icon_file: Joi.string()
      .trim()
      .default("/icons/default.png")
  });

  return socialSchema.validate(data, { abortEarly: false });
}; 