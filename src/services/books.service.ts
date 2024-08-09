import { BookCreateDTO, BookCreateResponse, BookGetResponse, BooksGetResponse } from "../dtos/book.dto";
import db from "../db";
import ApiError from "../utils/apiErrors";
import { isUUID } from "../utils";
class BooksService {
  async createBook(dto: BookCreateDTO): Promise<BookCreateResponse> {
    const book = await db.books.create({ data: { ...dto, publicationDate: new Date(dto.publicationDate) } });
    return book;
  }

  async getBooks(): Promise<BooksGetResponse> {
    const books = await db.books.findMany();
    return books;
  }

  async getBookById(id: string): Promise<BookGetResponse> {
    if (!isUUID(id)) {
      throw ApiError.badRequest("Invalid book id");
    }

    const book = await db.books.findUnique({ where: { id } });

    if (!book) {
      throw ApiError.notFound();
    }

    return book;
  }

  async updateBook(id: string, dto: BookCreateDTO) {
    await this.getBookById(id);

    const book = await db.books.update({ where: { id }, data: { ...dto, publicationDate: new Date(dto.publicationDate) } });
    return book;
  }

  async deleteBook(id: string) {
    await this.getBookById(id);
    await db.books.delete({ where: { id } });
  }
}

export default new BooksService();
