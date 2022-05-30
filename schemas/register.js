const Joi = require("joi");

module.exports = Joi.object({
  firstName: Joi.string().required().min(3).max(30).label("fNameErr"),
  lastName: Joi.string().required().min(3).max(30).label("lNameErr"),
  email: Joi.string().required().min(3).max(30).email().label("emailErr"),
  password: Joi.string()
    .required()
    .min(8)
    .max(30)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .message("Password is invalid")
    .label("password"),
  confPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({ "any.only": "Passwords not matched" }),
});
