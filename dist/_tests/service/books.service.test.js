"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../db"));
const books_service_1 = __importDefault(require("../../services/books.service"));
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
describe("user", () => {
    let id;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.clearAllMocks();
        yield db_1.default.$connect();
        yield yield db_1.default.books.deleteMany();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.$disconnect();
    }));
    describe("create book", () => {
        it("should sucsesfully return book", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockBookDTO = {
                title: "test",
                author: "bobrik",
                publicationDate: "2000.11.11",
                genres: ["scary", "strashilka"],
            };
            const result = yield books_service_1.default.createBook(mockBookDTO);
            id = result.id;
            expect(result).toEqual({
                id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                title: "test",
                author: "bobrik",
                publicationDate: new Date("2000.11.11"),
                genres: ["scary", "strashilka"],
            });
        }));
        describe("get book", () => {
            it("should sucsesfully return book", () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield books_service_1.default.getBookById(id);
                expect(result).toEqual({
                    id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                    title: "test",
                    author: "bobrik",
                    publicationDate: new Date("2000.11.11"),
                    genres: ["scary", "strashilka"],
                });
            }));
            it("not found", () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(books_service_1.default.getBookById("f6b0ca2a-4921-40a4-b97c-d7093f3ac62e")).rejects.toThrow(apiErrors_1.default.notFound());
            }));
            it("invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(books_service_1.default.getBookById("1")).rejects.toThrow(apiErrors_1.default.badRequest("Invalid book id"));
            }));
        });
        describe("get books", () => {
            it("should sucsesfully return books", () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield books_service_1.default.getBooks();
                expect(result).toEqual([
                    {
                        id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                        title: "test",
                        author: "bobrik",
                        publicationDate: new Date("2000.11.11"),
                        genres: ["scary", "strashilka"],
                    },
                ]);
            }));
        });
        describe("update book", () => {
            it("should sucsesfully return book", () => __awaiter(void 0, void 0, void 0, function* () {
                const mockBookDTO = {
                    title: "test1",
                    author: "bobrik",
                    publicationDate: "2000.11.11",
                    genres: ["scary", "strashilka1"],
                };
                const result = yield books_service_1.default.updateBook(id, mockBookDTO);
                expect(result).toEqual({
                    id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                    title: "test1",
                    author: "bobrik",
                    publicationDate: new Date("2000.11.11"),
                    genres: ["scary", "strashilka1"],
                });
            }));
            it("not found", () => __awaiter(void 0, void 0, void 0, function* () {
                const mockBookDTO = {
                    title: "test1",
                    author: "bobrik",
                    publicationDate: "2000.11.11",
                    genres: ["scary", "strashilka1"],
                };
                yield expect(books_service_1.default.updateBook("f6b0ca2a-4921-40a4-b97c-d7093f3ac62e", mockBookDTO)).rejects.toThrow(apiErrors_1.default.notFound());
            }));
            it("invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
                const mockBookDTO = {
                    title: "test1",
                    author: "bobrik",
                    publicationDate: "2000.11.11",
                    genres: ["scary", "strashilka1"],
                };
                yield expect(books_service_1.default.updateBook("1", mockBookDTO)).rejects.toThrow(apiErrors_1.default.badRequest("Invalid book id"));
            }));
        });
        describe("delete book", () => {
            it("should sucsesfully delete book", () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield books_service_1.default.deleteBook(id);
                yield expect(books_service_1.default.getBookById(id)).rejects.toThrow(apiErrors_1.default.notFound());
            }));
        });
    });
});
