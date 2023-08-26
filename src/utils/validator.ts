import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      "any.required": "Username is required",
      "string.empty": "Username cannot be empty.",
      "string.base": "Username must be a string.",
    })
    .min(5)
    .message("Username must have at least 5 characters."),
  password: Joi.string()
    .required()
    .messages({ "any.required": "Password is required" })
    .min(8)
    .message("Password must have at least 8 characters."),
});

export const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      "any.required": "Userame is required",
      "string.empty": "Username field cannot be empty.",
      "string.base": "Username must be a string.",
    })
    .min(5)
    .message("Username must have at least 5 characters."),
  password: Joi.string()
    .required()
    .messages({ "any.required": "Password is required" })
    .min(8)
    .message("Password must have at least 8 characters."),
});

export const createTaskSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.empty": "Task field cannot be empty.",
    "string.base": "Title must be a string.",
  }),
  description: Joi.string()
    .required()
    .messages({
      "any.required": "Descripton is required",
      "string.empty": "Description field cannot be empty.",
      "string.base": "Description must be a string.",
    })
    .min(10)
    .message("Description must have at least 10 characters."),
});
