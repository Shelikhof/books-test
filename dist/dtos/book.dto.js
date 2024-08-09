"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookUpdateSchema = exports.BookCreateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.BookCreateSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    author: joi_1.default.string().required(),
    publicationDate: joi_1.default.date().required(),
    genres: joi_1.default.array(),
});
exports.BookUpdateSchema = exports.BookCreateSchema.keys();
