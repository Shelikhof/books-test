import { Router } from "express";
import checkRole from "../middlewares/checkRole.middleware";
import booksController from "../controllers/books.controller";
import { dtoValidationMiddleware } from "../middlewares/dtoValidation.middleware";
import { BookCreateSchema, BookUpdateSchema } from "../dtos/book.dto";

const booksRouter = Router();

booksRouter.post("/", checkRole(["admin"]), dtoValidationMiddleware(BookCreateSchema), booksController.createBook);
booksRouter.get("/", checkRole(), booksController.getBooks);
booksRouter.get("/:id", checkRole(), booksController.getBookById);
booksRouter.put("/:id", checkRole(["admin"]), dtoValidationMiddleware(BookUpdateSchema), booksController.updateBook);
booksRouter.delete("/:id", checkRole(["admin"]), booksController.deleteBook);

export default booksRouter;
