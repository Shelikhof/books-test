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
describe("user controller", () => {
    let app;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.$connect();
        yield db_1.default.users.deleteMany();
        app = (0, createApp_1.createApp)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.$disconnect();
    }));
    describe("/users/register", () => {
        it("successful registration", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                email: "chertilla1337chzh@gmail.com",
                username: "valera",
                password: "1337",
            };
            const res = yield (0, supertest_1.default)(app).post("/users/register").send(mockUserDTO);
            expect(res.status).toEqual(200);
            expect(res.body).toEqual({
                id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                username: "valera",
                password: expect.any(String),
                email: "chertilla1337chzh@gmail.com",
                roles: 1,
            });
        }));
        it("should return error (email)", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                email: "chertilla1337chzh@gmail.com",
                username: "valera",
                password: "1337",
            };
            const res = yield (0, supertest_1.default)(app).post("/users/register").send(mockUserDTO);
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({ message: "User with this email already exists" });
        }));
        it("should return error (username)", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                email: "1chertilla1337chzh@gmail.com",
                username: "valera",
                password: "1337",
            };
            const res = yield (0, supertest_1.default)(app).post("/users/register").send(mockUserDTO);
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({ message: "User with this username already exists" });
        }));
        it("check validation dto", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                username: "valera",
                password: "1337",
            };
            const res = yield (0, supertest_1.default)(app).post("/users/register").send(mockUserDTO);
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({ message: `"email" is required` });
        }));
    });
    describe("/users/login", () => {
        it("successful login", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                username: "valera",
                password: "1337",
            };
            const res = yield (0, supertest_1.default)(app).post("/users/login").send(mockUserDTO);
            expect(res.status).toEqual(200);
            expect(res.body).toEqual({
                token: expect.any(String),
            });
        }));
        it("incorrect login", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                username: "valera1",
                password: "1337",
            };
            const res = yield (0, supertest_1.default)(app).post("/users/login").send(mockUserDTO);
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({
                message: "Incorrect data (login)",
            });
        }));
        it("incorrect password", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                username: "valera",
                password: "13371",
            };
            const res = yield (0, supertest_1.default)(app).post("/users/login").send(mockUserDTO);
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({
                message: "Incorrect data (password)",
            });
        }));
    });
    describe("me", () => {
        it("get me info", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                username: "valera",
                password: "1337",
            };
            yield (0, supertest_1.default)(app)
                .post("/users/login")
                .send(mockUserDTO)
                .then((data) => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield (0, supertest_1.default)(app).get("/users/me").set("Authorization", `Bearer ${data.body.token}`);
                expect(res.status).toEqual(200);
                expect(res.body).toEqual({
                    id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                    username: "valera",
                    email: "chertilla1337chzh@gmail.com",
                    isEmailVerified: false,
                    roles: 1,
                });
            }));
        }));
        it("invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get("/users/me").set("Authorization", `Bearer byp`);
            expect(res.status).toEqual(401);
            expect(res.body).toEqual({
                message: "User is not authorized",
            });
        }));
    });
    describe("role", () => {
        it("change role", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAdmin = {
                username: "admin",
                password: "1337",
            };
            const user = yield db_1.default.users.findUnique({
                where: {
                    username: "valera",
                },
                select: {
                    id: true,
                },
            });
            yield (0, supertest_1.default)(app)
                .post("/users/login")
                .send(mockAdmin)
                .then((data) => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield (0, supertest_1.default)(app)
                    .put(`/users/${user === null || user === void 0 ? void 0 : user.id}/role`)
                    .set("Authorization", `Bearer ${data.body.token}`)
                    .send({ roles: ["admin", "user"] });
                expect(res.status).toEqual(200);
                expect(res.body).toEqual({
                    id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                    username: "valera",
                    email: "chertilla1337chzh@gmail.com",
                    isEmailVerified: false,
                    roles: 3,
                });
            }));
        }));
        it("change role again", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAdmin = {
                username: "valera",
                password: "1337",
            };
            const user = yield db_1.default.users.findUnique({
                where: {
                    username: "valera",
                },
                select: {
                    id: true,
                },
            });
            yield (0, supertest_1.default)(app)
                .post("/users/login")
                .send(mockAdmin)
                .then((data) => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield (0, supertest_1.default)(app)
                    .put(`/users/${user === null || user === void 0 ? void 0 : user.id}/role`)
                    .set("Authorization", `Bearer ${data.body.token}`)
                    .send({ roles: ["user"] });
                expect(res.status).toEqual(200);
                expect(res.body).toEqual({
                    id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                    username: "valera",
                    email: "chertilla1337chzh@gmail.com",
                    isEmailVerified: false,
                    roles: 1,
                });
            }));
        }));
        it("access denied", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAdmin = {
                username: "valera",
                password: "1337",
            };
            const user = yield db_1.default.users.findUnique({
                where: {
                    username: "valera",
                },
                select: {
                    id: true,
                },
            });
            yield (0, supertest_1.default)(app)
                .post("/users/login")
                .send(mockAdmin)
                .then((data) => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield (0, supertest_1.default)(app)
                    .put(`/users/${user === null || user === void 0 ? void 0 : user.id}/role`)
                    .set("Authorization", `Bearer ${data.body.token}`)
                    .send({ roles: ["admin", "user"] });
                expect(res.status).toEqual(403);
                expect(res.body).toEqual({
                    message: "Access is denied",
                });
            }));
        }));
    });
});
