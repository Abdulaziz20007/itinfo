const Joi = require("joi");

const authorFullName = (parent) => {
  return parent.author_first_name + " " + parent.author_last_name;
};

exports.authorValidation = (data) => {
  const authorSchema = Joi.object({
    author_first_name: Joi.string().required(),
    author_last_name: Joi.string(),
    // author_full_name: Joi.string().default(
    //   authorFullName({ author_first_name, author_last_name })
    // ),
    author_nick_name: Joi.string().min(2).max(20),
    author_password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password: Joi.ref("author_password"),
    author_email: Joi.string().email().lowercase(),
    author_phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}/),
    author_info: Joi.string(),
    author_position: Joi.string(),
    author_photo: Joi.string().default("/author/avatar.png"),
    author_is_expert: Joi.boolean().default(false),
    author_is_active: Joi.boolean().default(false),
    gender: Joi.string().valid("erkak", "ayol"),
    birth_date: Joi.date().less("2000-01-01"),
  });

  return authorSchema.validate(data, { abortEarly: false });
};
