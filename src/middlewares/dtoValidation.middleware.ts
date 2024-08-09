import { RequestHandler } from "express";
import Joi from "joi";

export const dtoValidationMiddleware = (schema: Joi.Schema): RequestHandler => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    next();
  };
};
