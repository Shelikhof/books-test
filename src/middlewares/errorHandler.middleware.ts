import { log } from "console";
import ApiError from "../utils/apiErrors";
import { NextFunction, Request, Response } from "express";

export const errorHandlerMiddleware = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  // log(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({ message: "Something went wrong" });
};
