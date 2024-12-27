const Joi = require("joi");

exports.topicValidation = (data) => {
  const topicSchema = Joi.object({
    author_id: Joi.string()
      .alphanum()
      .message("Author ID noto'g'ri")
      .required(),
    topic_title: Joi.string().required().trim(),
    topic_text: Joi.string().trim().required(),
    is_checked: Joi.boolean().default(false),
    is_approved: Joi.boolean().default(false),
    expert_id: Joi.string().alphanum(),
  });
  return topicSchema.validate(data, { abortEarly: false });
};