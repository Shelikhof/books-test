"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkRole;
const apiErrors_1 = __importDefault(require("../utils/apiErrors"));
const token_service_1 = __importDefault(require("../services/token.service"));
const roles_service_1 = __importDefault(require("../services/roles.service"));
//null, если доступно всем
function checkRole(roles = null, addData = false) {
    return (req, res, next) => {
        var _a;
        try {
            if (roles === null) {
                next();
            }
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            //если нет, токена и нужна роль -> дроп
            if (!token && roles !== null) {
                throw apiErrors_1.default.unauthorized();
            }
            if (token && roles) {
                const data = token_service_1.default.validateToken(token, process.env.JWT_TOKEN_KEY);
                if (data === null) {
                    throw apiErrors_1.default.unauthorized();
                }
                if (!roles_service_1.default.checkRole(data.roles, roles)) {
                    throw apiErrors_1.default.accessDenied();
                }
                if (addData)
                    req.body.tokenPayload = data;
                next();
            }
        }
        catch (error) {
            next(error);
        }
    };
}
