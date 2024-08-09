"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const apiErrors_1 = __importDefault(require("../utils/apiErrors"));
const errorHandlerMiddleware = (err, req, res, next) => {
    // log(err);
    if (err instanceof apiErrors_1.default) {
        return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: "Something went wrong" });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
