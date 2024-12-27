const Joi = require("joi");

exports.descTopicValidation = (data) => {
  const descTopicSchema = Joi.object({
    desc_id: Joi.string()
      .alphanum()
      .message("Description ID noto'g'ri")
      .required(),
    topic_id: Joi.string()
      .alphanum()
      .message("Topic ID noto'g'ri")
      .required()
  });

  return descTopicSchema.validate(data, { abortEarly: false });
}; 