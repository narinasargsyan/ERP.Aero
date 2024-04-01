import { RequestHandler } from "express";
import { validate } from "express-validation";

import { validationSchema } from "./common.schemas";

import { config } from "./index";

export const validateSchema = (name: string): RequestHandler => {
  const schema = validationSchema[name]
  return validate(schema, config, {});
};
