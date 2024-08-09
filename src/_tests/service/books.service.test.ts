import db from "../../db";
import booksService from "../../services/books.service";
import ApiError from "../../utils/apiErrors";

describe("user", () => {
  let id: string;

  beforeAll(async () => {
    jest.clearAllMocks();
    await db.$connect();
    await await db.books.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  describe("create book", () => {
    it("should sucsesfully return book", async () => {
      const mockBookDTO = {
        title: "test",
        author: "bobrik",
        publicationDate: "2000.11.11",
        genres: ["scary", "strashilka"],
      };

      const result = await booksService.createBook(mockBookDTO);
      id = result.id;
      expect(result).toEqual({
        id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        title: "test",
        author: "bobrik",
        publicationDate: new Date("2000.11.11"),
        genres: ["scary", "strashilka"],
      });
    });

    describe("get book", () => {
      it("should sucsesfully return book", async () => {
        const result = await booksService.getBookById(id);
        expect(result).toEqual({
          id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
          title: "test",
          author: "bobrik",
          publicationDate: new Date("2000.11.11"),
          genres: ["scary", "strashilka"],
        });
      });

      it("not found", async () => {
        await expect(booksService.getBookById("f6b0ca2a-4921-40a4-b97c-d7093f3ac62e")).rejects.toThrow(ApiError.notFound());
      });

      it("invalid id", async () => {
        await expect(booksService.getBookById("1")).rejects.toThrow(ApiError.badRequest("Invalid book id"));
      });
    });

    describe("get books", () => {
      it("should sucsesfully return books", async () => {
        const result = await booksService.getBooks();
        expect(result).toEqual([
          {
            id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
            title: "test",
            author: "bobrik",
            publicationDate: new Date("2000.11.11"),
            genres: ["scary", "strashilka"],
          },
        ]);
      });
    });

    describe("update book", () => {
      it("should sucsesfully return book", async () => {
        const mockBookDTO = {
          title: "test1",
          author: "bobrik",
          publicationDate: "2000.11.11",
          genres: ["scary", "strashilka1"],
        };

        const result = await booksService.updateBook(id, mockBookDTO);
        expect(result).toEqual({
          id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
          title: "test1",
          author: "bobrik",
          publicationDate: new Date("2000.11.11"),
          genres: ["scary", "strashilka1"],
        });
      });

      it("not found", async () => {
        const mockBookDTO = {
          title: "test1",
          author: "bobrik",
          publicationDate: "2000.11.11",
          genres: ["scary", "strashilka1"],
        };

        await expect(booksService.updateBook("f6b0ca2a-4921-40a4-b97c-d7093f3ac62e", mockBookDTO)).rejects.toThrow(ApiError.notFound());
      });

      it("invalid id", async () => {
        const mockBookDTO = {
          title: "test1",
          author: "bobrik",
          publicationDate: "2000.11.11",
          genres: ["scary", "strashilka1"],
        };
        await expect(booksService.updateBook("1", mockBookDTO)).rejects.toThrow(ApiError.badRequest("Invalid book id"));
      });
    });

    describe("delete book", () => {
      it("should sucsesfully delete book", async () => {
        const result = await booksService.deleteBook(id);
        await expect(booksService.getBookById(id)).rejects.toThrow(ApiError.notFound());
      });
    });
  });
});
