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
const db_1 = __importDefault(require("../db"));
const apiErrors_1 = __importDefault(require("../utils/apiErrors"));
const utils_1 = require("../utils");
class BooksService {
    createBook(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield db_1.default.books.create({ data: Object.assign(Object.assign({}, dto), { publicationDate: new Date(dto.publicationDate) }) });
            return book;
        });
    }
    getBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            const books = yield db_1.default.books.findMany();
            return books;
        });
    }
    getBookById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, utils_1.isUUID)(id)) {
                throw apiErrors_1.default.badRequest("Invalid book id");
            }
            const book = yield db_1.default.books.findUnique({ where: { id } });
            if (!book) {
                throw apiErrors_1.default.notFound();
            }
            return book;
        });
    }
    updateBook(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getBookById(id);
            const book = yield db_1.default.books.update({ where: { id }, data: Object.assign(Object.assign({}, dto), { publicationDate: new Date(dto.publicationDate) }) });
            return book;
        });
    }
    deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getBookById(id);
            yield db_1.default.books.delete({ where: { id } });
        });
    }
}
exports.default = new BooksService();
