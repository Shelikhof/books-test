import { NextFunction, Request, RequestHandler, Response } from "express";
import { BookCreateDTO, BookCreateResponse, BookGetResponse, BooksGetResponse, BookUpdateResponse } from "../dtos/book.dto";
import booksService from "../services/books.service";

class BooksController {
  async createBook(req: Request<any, any, BookCreateDTO>, res: Response<BookCreateResponse>, next: NextFunction) {
    try {
      const result = await booksService.createBook(req.body);
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getBooks(req: Request, res: Response<BooksGetResponse>, next: NextFunction) {
    try {
      const result = await booksService.getBooks();
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getBookById(req: Request<{ id: string }>, res: Response<BookGetResponse>, next: NextFunction) {
    try {
      const result = await booksService.getBookById(req.params.id);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateBook(req: Request<{ id: string }, any, BookCreateDTO>, res: Response<BookUpdateResponse>, next: NextFunction) {
    try {
      const result = await booksService.updateBook(req.params.id, req.body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteBook(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await booksService.deleteBook(req.params.id);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new BooksController();
