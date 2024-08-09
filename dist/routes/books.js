"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkRole_middleware_1 = __importDefault(require("../middlewares/checkRole.middleware"));
const books_controller_1 = __importDefault(require("../controllers/books.controller"));
const dtoValidation_middleware_1 = require("../middlewares/dtoValidation.middleware");
const book_dto_1 = require("../dtos/book.dto");
const booksRouter = (0, express_1.Router)();
booksRouter.post("/", (0, checkRole_middleware_1.default)(["admin"]), (0, dtoValidation_middleware_1.dtoValidationMiddleware)(book_dto_1.BookCreateSchema), books_controller_1.default.createBook);
booksRouter.get("/", (0, checkRole_middleware_1.default)(), books_controller_1.default.getBooks);
booksRouter.get("/:id", (0, checkRole_middleware_1.default)(), books_controller_1.default.getBookById);
booksRouter.put("/:id", (0, checkRole_middleware_1.default)(["admin"]), (0, dtoValidation_middleware_1.dtoValidationMiddleware)(book_dto_1.BookUpdateSchema), books_controller_1.default.updateBook);
booksRouter.delete("/:id", (0, checkRole_middleware_1.default)(["admin"]), books_controller_1.default.deleteBook);
exports.default = booksRouter;
