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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const apiErrors_1 = __importDefault(require("../utils/apiErrors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_service_1 = __importDefault(require("./token.service"));
const console_1 = require("console");
const roles_service_1 = __importDefault(require("./roles.service"));
const mail_service_1 = __importDefault(require("./mail.service"));
class UserService {
    register(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            //проверка на наличие пользователя по email
            const userExistsEmail = yield db_1.default.users.findUnique({
                where: {
                    email: dto.email,
                },
            });
            if (userExistsEmail) {
                throw apiErrors_1.default.badRequest("User with this email already exists");
            }
            //проверка на наличие пользователя по username
            const userExistsUsername = yield db_1.default.users.findUnique({
                where: {
                    username: dto.username,
                },
            });
            if (userExistsUsername) {
                throw apiErrors_1.default.badRequest("User with this username already exists");
            }
            //подтверждение почты
            const token = token_service_1.default.generateToken({ email: dto.email }, process.env.JWT_VERIFY_KEY, process.env.JWT_VERIFY_LIVETIME);
            const link = `http://localhost:3000/users/register/verify/${token}`;
            yield mail_service_1.default.sendActivationMail(dto.email, link);
            //хэширование пароля
            const hashPassword = bcryptjs_1.default.hashSync(dto.password);
            //создание пользователя
            const user = yield db_1.default.users.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    password: hashPassword,
                },
            });
            const { isEmailVerified } = user, res = __rest(user, ["isEmailVerified"]);
            return res;
        });
    }
    login(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            //проверка на наличие пользователя по логину
            const user = yield db_1.default.users.findUnique({
                where: {
                    username: dto.username,
                },
            });
            if (!user) {
                throw apiErrors_1.default.badRequest("Incorrect data (login)");
            }
            //провекрка пароля
            const isPasswordValid = bcryptjs_1.default.compareSync(dto.password, user.password);
            if (!isPasswordValid) {
                throw apiErrors_1.default.badRequest("Incorrect data (password)");
            }
            //генерация токена
            const token = token_service_1.default.generateToken({ id: user.id, roles: user.roles }, process.env.JWT_TOKEN_KEY, process.env.JWT_TOKEN_LIVETIME);
            return {
                token,
            };
        });
    }
    me(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.default.users.findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    roles: true,
                    isEmailVerified: true,
                },
            });
            if (!user) {
                throw apiErrors_1.default.notFound();
            }
            return user;
        });
    }
    changeRole(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            //проверка на наличие пользователя
            const user = yield db_1.default.users.findUnique({
                where: {
                    id,
                },
            });
            if (!user) {
                throw apiErrors_1.default.notFound();
            }
            const roleNum = roles_service_1.default.generateRolesNum(dto.roles);
            const updatedUser = yield db_1.default.users.update({
                where: {
                    id,
                },
                data: {
                    roles: roleNum,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    roles: true,
                    isEmailVerified: true,
                },
            });
            return updatedUser;
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = token_service_1.default.validateToken(token, process.env.JWT_VERIFY_KEY);
            if (!payload) {
                throw apiErrors_1.default.badRequest("Invalid token");
            }
            (0, console_1.log)(payload);
            const user = yield db_1.default.users.update({
                where: {
                    email: payload.email,
                },
                data: {
                    isEmailVerified: true,
                },
            });
            return;
        });
    }
}
exports.default = new UserService();
