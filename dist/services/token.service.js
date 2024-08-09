"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    generateToken(payload, key, expiresIn) {
        const token = jsonwebtoken_1.default.sign(payload, key, { expiresIn });
        return token;
    }
    validateToken(token, key) {
        try {
            const data = jsonwebtoken_1.default.verify(token, key);
            return data;
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = new TokenService();
