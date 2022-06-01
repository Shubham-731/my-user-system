const Joi = require("joi");

module.exports = Joi.object({
  firstName: Joi.string()
    .required()
    .min(3)
    .max(30)
    .messages({
      "string.min": "Minimum 3 character required",
      "string.max": "Maximum 30 characters required",
      "string.empty": "First name is required",
    })
    .label("fNameErr"),
  lastName: Joi.string()
    .required()
    .min(3)
    .max(30)
    .messages({
      "string.min": "Minimum 3 character required",
      "string.max": "Maximum 30 characters required",
      "string.empty": "Last name is required",
    })
    .label("lNameErr"),
  email: Joi.string()
    .required()
    .min(8)
    .max(30)
    .email()
    .messages({
      "string.min": "Minimum 8 character required",
      "string.max": "Maximum 30 characters required",
      "string.email": "Invalid email",
      "string.empty": "Email is required",
    })
    .label("emailErr"),
  password: Joi.string()
    .required()
    .min(8)
    .max(30)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/)
    .messages({
      "string.min": "Minimum 8 character required",
      "string.max": "Maximum 30 characters required",
      "string.empty": "Password must not be empty",
      "string.pattern.base": "Invalid password",
    })
    .label("passErr"),
  confPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "string.min": "Minimum 3 character required",
      "string.max": "Maximum 30 characters required",
      "string.empty": "Enter password again",
      "any.only": "Passwords not matched",
    })
    .label("confPassErr"),
});
