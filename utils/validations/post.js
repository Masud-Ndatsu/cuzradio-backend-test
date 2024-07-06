const Joi = require("joi");

const validateCreatePostSchema = (postReq) => {
     const postValidationSchema = Joi.object({
          title: Joi.string().required().messages({
               "string.empty": "Title is required.",
               "any.required": "Title is required.",
          }),
          content: Joi.string().required().messages({
               "string.empty": "Content is required.",
               "any.required": "Content is required.",
          }),
          tags: Joi.array().items(Joi.string()).default([]).messages({
               "array.base": "Tags must be an array of strings.",
          }),
          status: Joi.string()
               .valid("draft", "published", "archived")
               .default("draft")
               .messages({
                    "any.only":
                         "Status must be one of draft, published, or archived.",
               }),
     });
     return postValidationSchema.validate(postReq);
};

const validateUpdatePostSchema = (postReq) => {
     const updatePostValidationSchema = Joi.object({
          title: Joi.string().optional().messages({
               "string.empty": "Title must be a string.",
          }),
          content: Joi.string().optional().messages({
               "string.empty": "Content must be a string.",
          }),
          tags: Joi.array().items(Joi.string()).messages({
               "array.base": "Tags must be an array of strings.",
          }),
          status: Joi.string()
               .valid("draft", "published", "archived")
               .optional()
               .messages({
                    "any.only":
                         "Status must be one of draft, published, or archived.",
               }),
     })
          .min(1)
          .messages({
               "object.min": "At least one field must be updated.",
          });

     return updatePostValidationSchema.validate(postReq);
};

module.exports = {
     validateCreatePostSchema,
     validateUpdatePostSchema,
};
