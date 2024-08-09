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
const token_service_1 = __importDefault(require("../../services/token.service"));
const user_service_1 = __importDefault(require("../../services/user.service"));
const apiErrors_1 = __importDefault(require("../../utils/apiErrors"));
describe("user", () => {
    let prisma;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jest.clearAllMocks();
        prisma = yield db_1.default.$connect();
        yield yield db_1.default.users.deleteMany();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.$disconnect();
    }));
    describe("register", () => {
        it("should sucsesfully return user", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                email: "chertilla1337chzh@gmail.com",
                username: "valera",
                password: "1337",
            };
            const result = yield user_service_1.default.register(mockUserDTO);
            expect(result).toEqual({
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
            yield expect(user_service_1.default.register(mockUserDTO)).rejects.toThrow(apiErrors_1.default.badRequest("User with this email already exists"));
        }));
        it("should return error (username)", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                email: "chertilla1337chzh1@gmail.com",
                username: "valera",
                password: "1337",
            };
            yield expect(user_service_1.default.register(mockUserDTO)).rejects.toThrow(apiErrors_1.default.badRequest("User with this username already exists"));
        }));
    });
    describe("login", () => {
        it("login user", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                username: "valera",
                password: "1337",
            };
            yield expect(user_service_1.default.login(mockUserDTO)).resolves.toEqual({
                token: expect.any(String),
            });
        }));
        it("invalid username", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                username: "valera1",
                password: "1337",
            };
            yield expect(user_service_1.default.login(mockUserDTO)).rejects.toThrow(apiErrors_1.default.badRequest("Incorrect data (login)"));
        }));
        it("invalid password", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                username: "valera",
                password: "13371",
            };
            yield expect(user_service_1.default.login(mockUserDTO)).rejects.toThrow(apiErrors_1.default.badRequest("Incorrect data (password)"));
        }));
    });
    describe("me", () => {
        it("get me info", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                username: "valera",
                password: "1337",
            };
            const { token } = yield user_service_1.default.login(mockUserDTO);
            const data = token_service_1.default.validateToken(token, process.env.JWT_TOKEN_KEY);
            yield expect(user_service_1.default.me(data.id)).resolves.toEqual({
                id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                username: "valera",
                email: "chertilla1337chzh@gmail.com",
                isEmailVerified: false,
                roles: 1,
            });
        }));
        it("invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(user_service_1.default.me("f6b0ca2a-4921-40a4-b97c-d7093f3ac62e")).rejects.toThrow(apiErrors_1.default.notFound());
        }));
    });
    describe("role", () => {
        it("change user role (+ admin)", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserDTO = {
                username: "valera",
                password: "1337",
            };
            user_service_1.default.login(mockUserDTO).then((data) => __awaiter(void 0, void 0, void 0, function* () {
                const dataToken = token_service_1.default.validateToken(data.token, process.env.JWT_TOKEN_KEY);
                const userId = dataToken.id;
                const mockUserRoleDTO = {
                    roles: ["admin", "user"],
                };
                yield expect(user_service_1.default.changeRole(userId, mockUserRoleDTO)).resolves.toEqual({
                    id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                    username: "valera",
                    email: "chertilla1337chzh@gmail.com",
                    isEmailVerified: false,
                    roles: 3,
                });
            }));
        }));
    });
});
