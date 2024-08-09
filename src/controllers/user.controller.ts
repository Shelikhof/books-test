import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { UserLoginDTO, UserLoginResponse, UserMeResponse, UserRegisterDTO, UserRegisterResponse, UserRoleDTO, UserRoleResponse } from "../dtos/user.dto";
import { tokenPayload } from "../utils/interfaces";
import { log } from "console";

class UserController {
  async register(req: Request<any, any, UserRegisterDTO>, res: Response<UserRegisterResponse>, next: NextFunction) {
    try {
      const result = await userService.register(req.body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request<any, any, UserLoginDTO>, res: Response<UserLoginResponse>, next: NextFunction) {
    try {
      const result = await userService.login(req.body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request<any, any, { tokenPayload: tokenPayload }>, res: Response<UserMeResponse>, next: NextFunction) {
    try {
      const data = req.body.tokenPayload;
      const result = await userService.me(data.id);
      await res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async changeRole(req: Request<{ id: string }, any, UserRoleDTO>, res: Response<UserRoleResponse>, next: NextFunction) {
    try {
      const result = await userService.changeRole(req.params.id, req.body);
      await res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request<{ token: string }>, res: Response, next: NextFunction) {
    try {
      const result = await userService.verifyEmail(req.params.token);
      await res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
