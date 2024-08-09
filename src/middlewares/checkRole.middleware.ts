import { RequestHandler } from "express";
import ApiError from "../utils/apiErrors";
import tokenService from "../services/token.service";
import { tokenPayload } from "../utils/interfaces";
import { log } from "console";
import { rolesKeys } from "../utils/variables/roles";
import rolesService from "../services/roles.service";

//null, если доступно всем
export default function checkRole(roles: rolesKeys[] | null = null, addData: boolean = false): RequestHandler {
  return (req, res, next) => {
    try {
      if (roles === null) {
        next();
      }

      const token = req.headers.authorization?.split(" ")[1];

      //если нет, токена и нужна роль -> дроп
      if (!token && roles !== null) {
        throw ApiError.unauthorized();
      }

      if (token && roles) {
        const data = tokenService.validateToken<tokenPayload>(token, process.env.JWT_TOKEN_KEY as string);
        if (data === null) {
          throw ApiError.unauthorized();
        }

        if (!rolesService.checkRole(data.roles, roles)) {
          throw ApiError.accessDenied();
        }

        if (addData) req.body.tokenPayload = data;
        next();
      }
    } catch (error) {
      next(error);
    }
  };
}
