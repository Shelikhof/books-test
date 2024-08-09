"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleSchema = exports.UserLoginSchema = exports.UserRegisterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const roles_1 = require("../utils/variables/roles");
exports.UserRegisterSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
exports.UserLoginSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
exports.UserRoleSchema = joi_1.default.object({
    roles: joi_1.default.array()
        .items(joi_1.default.string().valid(...Object.keys(roles_1.ROLES)))
        .required(),
});
