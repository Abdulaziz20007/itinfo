const Joi = require("joi");

exports.adminValidation = (data) => {
  const adminSchema = Joi.object({
    admin_name: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        "string.empty": "Admin name cannot be empty",
        "string.min": "Admin name must be at least 3 characters long",
        "string.max": "Admin name cannot exceed 30 characters",
        "any.required": "Admin name is required"
      }),
    admin_email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Please enter a valid email",
        "any.required": "Email is required"
      }),
    admin_phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required()
      .messages({
        "string.pattern.base": "Please enter a valid phone number",
        "any.required": "Phone number is required"
      }),
    admin_password: Joi.string()
      .min(6)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters long",
        "string.pattern.base": "Password must contain only alphanumeric characters",
        "any.required": "Password is required"
      }),
    admin_is_active: Joi.boolean().default(true),
    admin_is_creator: Joi.boolean().default(false)
  });

  return adminSchema.validate(data, { abortEarly: false });
}; 