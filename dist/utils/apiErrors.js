"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
    static badRequest(message) {
        return new ApiError(400, message);
    }
    static unauthorized() {
        return new ApiError(401, "User is not authorized");
    }
    static accessDenied() {
        return new ApiError(403, "Access is denied");
    }
    static notFound() {
        return new ApiError(404, "Not found");
    }
}
exports.default = ApiError;
