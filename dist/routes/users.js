"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const dtoValidation_middleware_1 = require("../middlewares/dtoValidation.middleware");
const user_dto_1 = require("../dtos/user.dto");
const checkRole_middleware_1 = __importDefault(require("../middlewares/checkRole.middleware"));
const usersRouter = (0, express_1.Router)();
usersRouter.get("/register/verify/:token", (0, checkRole_middleware_1.default)(), user_controller_1.default.verify);
usersRouter.post("/register", (0, checkRole_middleware_1.default)(), (0, dtoValidation_middleware_1.dtoValidationMiddleware)(user_dto_1.UserRegisterSchema), user_controller_1.default.register);
usersRouter.post("/login", (0, checkRole_middleware_1.default)(), (0, dtoValidation_middleware_1.dtoValidationMiddleware)(user_dto_1.UserLoginSchema), user_controller_1.default.login);
usersRouter.put("/:id/role", (0, checkRole_middleware_1.default)(["admin"]), (0, dtoValidation_middleware_1.dtoValidationMiddleware)(user_dto_1.UserRoleSchema), user_controller_1.default.changeRole);
usersRouter.get("/me", (0, checkRole_middleware_1.default)(["user"], true), user_controller_1.default.me);
exports.default = usersRouter;
