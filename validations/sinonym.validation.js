const Joi = require("joi");

exports.sinonymValidation = (data) => {
  const sinonymSchema = Joi.object({
    dict_id: Joi.string().alphanum().message("Dictionary ID noto'g'ri").required(),
    desc_id: Joi.string().alphanum().message("Description ID noto'g'ri").required(),
  });
  return sinonymSchema.validate(data, { abortEarly: false });
};
