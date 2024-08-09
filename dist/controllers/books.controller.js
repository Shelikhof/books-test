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
const books_service_1 = __importDefault(require("../services/books.service"));
class BooksController {
    createBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield books_service_1.default.createBook(req.body);
                res.status(201).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getBooks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield books_service_1.default.getBooks();
                res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getBookById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield books_service_1.default.getBookById(req.params.id);
                res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield books_service_1.default.updateBook(req.params.id, req.body);
                res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield books_service_1.default.deleteBook(req.params.id);
                res.status(200).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new BooksController();
