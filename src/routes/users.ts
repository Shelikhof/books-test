import { Request, Router } from "express";
import userController from "../controllers/user.controller";
import { dtoValidationMiddleware } from "../middlewares/dtoValidation.middleware";
import { UserLoginSchema, UserRegisterSchema, UserRoleSchema } from "../dtos/user.dto";
import checkRole from "../middlewares/checkRole.middleware";

const usersRouter = Router();

usersRouter.get("/register/verify/:token", checkRole(), userController.verify);
usersRouter.post("/register", checkRole(), dtoValidationMiddleware(UserRegisterSchema), userController.register);
usersRouter.post("/login", checkRole(), dtoValidationMiddleware(UserLoginSchema), userController.login);
usersRouter.put("/:id/role", checkRole(["admin"]), dtoValidationMiddleware(UserRoleSchema), userController.changeRole);
usersRouter.get("/me", checkRole(["user"], true), userController.me);

export default usersRouter;
