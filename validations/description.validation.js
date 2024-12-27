const Joi = require("joi");

exports.descriptionValidation = (data) => {
  const descriptionSchema = Joi.object({
    category_id: Joi.string().alphanum().message("ID noto'g'ri"),
    description: Joi.string().trim().required(),
  });
  return descriptionSchema.validate(data, { abortEarly: false });
};
