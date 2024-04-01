import { Joi } from "express-validation";

export const validationSchema = {
  signUpUserSchema: {
    body: Joi.object({
      email: Joi.string().email(),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/)
        .required()
        .messages({
          "string.min": "Password must be at least 8 characters long",
          "string.pattern.base": "Password must contain at least one uppercase letter(A-Z), one lowercase letter(a-z), one digit, and a special character.",
          "any.required": "Password is required",
        }),
      repeatPassword: Joi.any().valid(Joi.ref("password"))
        .required(),
      lastName: Joi.string(),
      firstName: Joi.string(),
      username: Joi.string()
        .trim()
        .regex(/^[^\s]{3,30}$/)
        .required(),
    })
  },

  signInUserSchema: {
     body: Joi.object({
       email: Joi.string().email(),
       password: Joi.string().required(),
     }),
  },

  refreshAccessTokenSchema: {
     body: Joi.object({
       refreshToken: Joi.string().required()
     }),
  },
};
