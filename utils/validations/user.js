const Joi = require("joi");

const validateCreateUser = (payload) => {
     const userValidationSchema = Joi.object({
          firstName: Joi.string().required().messages({
               "string.empty": "First name is required.",
               "any.required": "First name is required.",
          }),
          lastName: Joi.string().required().messages({
               "string.empty": "Last name is required.",
               "any.required": "Last name is required.",
          }),
          email: Joi.string().email().required().messages({
               "string.email": "Please use a valid email address.",
               "string.empty": "Email is required.",
               "any.required": "Email is required.",
          }),
          password: Joi.string().required().messages({
               "string.empty": "Password is required.",
               "any.required": "Password is required.",
          }),
          role: Joi.string().required().messages({
               "string.empty": "Role is required.",
               "any.required": "Role is required.",
          }),
          suspended: Joi.boolean().default(false),
     });

     return userValidationSchema.validate(payload);
};

const validateLoginUser = (payload) => {
     const userValidationSchema = Joi.object({
          email: Joi.string().required().messages({
               "string.email": "Please use a valid email address.",
               "string.empty": "Email is required.",
               "any.required": "Email is required.",
          }),
          password: Joi.string().required().messages({
               "string.empty": "Password is required.",
               "any.required": "Password is required.",
          }),
     });
     return userValidationSchema.validate(payload);
};

const validateChangeUserStatus = (payload) => {
     const userValidationSchema = Joi.object({
          status: Joi.string().valid("inactive", "active").required().messages({
               "string.empty": "Status is required.",
               "any.required": "Status is required.",
          }),
     });
     return userValidationSchema.validate(payload);
};

const validateUpdateUserRole = (payload) => {
     const userValidationSchema = Joi.object({
          role: Joi.string()
               .valid("admin", "moderator", "user")
               .required()
               .messages({
                    "string.empty": "Role is required.",
                    "any.required": "Role is required.",
               }),
     });
     return userValidationSchema.validate(payload);
};
module.exports = {
     validateCreateUser,
     validateLoginUser,
     validateChangeUserStatus,
     validateUpdateUserRole,
};
