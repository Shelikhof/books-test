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
const supertest_1 = __importDefault(require("supertest"));
const createApp_1 = require("../../createApp");
const db_1 = __importDefault(require("../../db"));
const console_1 = require("console");
describe("user controller", () => {
    let app;
    let adminToken;
    let id;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.$connect();
        yield db_1.default.books.deleteMany();
        app = (0, createApp_1.createApp)();
        const data = yield (0, supertest_1.default)(app).post("/users/login").send({
            username: "admin",
            password: "1337",
        });
        adminToken = data.body.token;
        (0, console_1.log)(adminToken);
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
            const res = yield (0, supertest_1.default)(app).post("/books").set("Authorization", `Bearer ${adminToken}`).send(mockBookDTO);
            id = res.body.id;
            expect(res.status).toEqual(201);
            expect(res.body).toEqual({
                id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                title: "test",
                author: "bobrik",
                publicationDate: new Date("2000.11.11").toISOString(),
                genres: ["scary", "strashilka"],
            });
        }));
        it("check validation dto", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockBookDTO = {
                author: "bobrik",
                publicationDate: "2000.11.11",
                genres: ["scary", "strashilka"],
            };
            const res = yield (0, supertest_1.default)(app).post("/books").set("Authorization", `Bearer ${adminToken}`).send(mockBookDTO);
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({ message: `"title" is required` });
        }));
        it("invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post("/books").set("Authorization", `Bearer byp`);
            expect(res.status).toEqual(401);
            expect(res.body).toEqual({
                message: "User is not authorized",
            });
        }));
    });
    describe("get books", () => {
        it("should sucsesfully return books", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get("/books");
            expect(res.status).toEqual(200);
            expect(res.body).toEqual([
                {
                    id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                    title: "test",
                    author: "bobrik",
                    publicationDate: new Date("2000.11.11").toISOString(),
                    genres: ["scary", "strashilka"],
                },
            ]);
        }));
    });
    describe("get book by id", () => {
        it("should sucsesfully return book", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get(`/books/${id}`);
            expect(res.status).toEqual(200);
            expect(res.body).toEqual({
                id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                title: "test",
                author: "bobrik",
                publicationDate: new Date("2000.11.11").toISOString(),
                genres: ["scary", "strashilka"],
            });
        }));
        it("not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get(`/books/f6b0ca2a-4921-40a4-b97c-d7093f3ac62e`);
            expect(res.status).toEqual(404);
            expect(res.body).toEqual({
                message: "Not found",
            });
        }));
        it("invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get(`/books/1`);
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({
                message: "Invalid book id",
            });
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
            const result = yield (0, supertest_1.default)(app).put(`/books/${id}`).set("Authorization", `Bearer ${adminToken}`).send(mockBookDTO);
            expect(result.status).toEqual(200);
            expect(result.body).toEqual({
                id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                title: "test1",
                author: "bobrik",
                publicationDate: new Date("2000.11.11").toISOString(),
                genres: ["scary", "strashilka1"],
            });
        }));
        it("should sucsesfully return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockBookDTO = {
                title: "test1",
                author: "bobrik",
                publicationDate: "2000.11.11",
                genres: ["scary", "strashilka1"],
            };
            const result = yield (0, supertest_1.default)(app).put(`/books/${id}`).set("Authorization", `Bearer 1`).send(mockBookDTO);
            expect(result.status).toEqual(401);
            expect(result.body).toEqual({
                message: "User is not authorized",
            });
        }));
    });
    describe("delete book", () => {
        it("should sucsesfully delete book", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, supertest_1.default)(app).delete(`/books/${id}`).set("Authorization", `Bearer ${adminToken}`);
            expect(result.status).toEqual(200);
            const res = yield (0, supertest_1.default)(app).get(`/books/${id}`);
            expect(res.status).toEqual(404);
            expect(res.body).toEqual({
                message: "Not found",
            });
        }));
    });
});
