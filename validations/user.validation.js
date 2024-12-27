const Joi = require("joi");

exports.userValidation = (data) => {
  const userSchema = Joi.object({
    user_name: Joi.string().min(3).max(30).required().messages({
      "string.empty": "Username cannot be empty",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username cannot exceed 30 characters",
      "any.required": "Username is required",
    }),
    user_email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email",
      "any.required": "Email is required",
    }),
    user_password: Joi.string()
      .min(6)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters long",
        "string.pattern.base":
          "Password must contain only alphanumeric characters",
        "any.required": "Password is required",
      }),
    user_info: Joi.string().allow(""),
    user_photo: Joi.string().allow(""),
  });

  return userSchema.validate(data, { abortEarly: false });
};
