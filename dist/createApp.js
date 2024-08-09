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
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("./db"));
const createApp = () => {
    const app = (0, express_1.default)();
    //добавление первого админа
    db_1.default.$connect().then(() => __awaiter(void 0, void 0, void 0, function* () {
        const admin = yield db_1.default.users.findUnique({
            where: {
                id: "11111111-1111-4111-8111-111111111111",
            },
        });
        if (admin)
            return;
        yield db_1.default.users.create({
            data: {
                id: "11111111-1111-4111-8111-111111111111",
                email: "admin@gmail.com",
                username: "admin",
                password: bcryptjs_1.default.hashSync("1337"),
                roles: 3,
                isEmailVerified: true,
            },
        });
    }));
    app.use(express_1.default.json());
    app.use("/", routes_1.default);
    app.use(errorHandler_middleware_1.errorHandlerMiddleware);
    return app;
};
exports.createApp = createApp;
