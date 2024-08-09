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
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_service_1.default.register(req.body);
                res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_service_1.default.login(req.body);
                res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    me(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body.tokenPayload;
                const result = yield user_service_1.default.me(data.id);
                yield res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    changeRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_service_1.default.changeRole(req.params.id, req.body);
                yield res.status(200).send(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    verify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_service_1.default.verifyEmail(req.params.token);
                yield res.status(200).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new UserController();
