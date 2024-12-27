const Joi = require("joi");

exports.tagValidation = (data) => {
  const tagSchema = Joi.object({
    topic_id: Joi.string()
      .alphanum()
      .message("Topic ID noto'g'ri")
      .required(),
    category_id: Joi.string()
      .alphanum()
      .message("Category ID noto'g'ri")
      .required()
  });

  return tagSchema.validate(data, { abortEarly: false });
}; 