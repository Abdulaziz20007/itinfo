const Joi = require("joi");

exports.dictionaryValidation = (data) => {
  const dictionarySchema = Joi.object({
    term: Joi.string()
      .required()
      .trim()
      .messages({
        "string.empty": "Term bo'sh bo'lishi mumkin emas!",
        "any.required": "Term kiritilishi shart!", 
      }),
    letter: Joi.string()
      .length(1)
      .required()
      .messages({
        "string.length": "Letter uzunligi 1 ta bo'lishi kerak!",
        "string.empty": "Letter bo'sh bo'lishi mumkin emas!",
        "any.required": "Letter kiritilishi shart!",
      })
  });

  return dictionarySchema.validate(data, { abortEarly: false });
}; 