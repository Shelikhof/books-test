import { UserLoginDTO, UserLoginResponse, UserMeResponse, UserRegisterDTO, UserRegisterResponse, UserRoleDTO, UserRoleResponse } from "../dtos/user.dto";
import db from "../db";
import ApiError from "../utils/apiErrors";
import bcrypt from "bcryptjs";
import tokenService from "./token.service";
import { tokenPayload } from "../utils/interfaces";
import { log } from "console";
import rolesService from "./roles.service";
import mailService from "./mail.service";

class UserService {
  async register(dto: UserRegisterDTO): Promise<UserRegisterResponse> {
    //проверка на наличие пользователя по email
    const userExistsEmail = await db.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (userExistsEmail) {
      throw ApiError.badRequest("User with this email already exists");
    }

    //проверка на наличие пользователя по username
    const userExistsUsername = await db.users.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (userExistsUsername) {
      throw ApiError.badRequest("User with this username already exists");
    }

    //подтверждение почты
    const token = tokenService.generateToken({ email: dto.email }, process.env.JWT_VERIFY_KEY as string, process.env.JWT_VERIFY_LIVETIME as string);
    const link = `http://localhost:3000/users/register/verify/${token}`;

    await mailService.sendActivationMail(dto.email, link);

    //хэширование пароля
    const hashPassword = bcrypt.hashSync(dto.password);

    //создание пользователя
    const user = await db.users.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashPassword,
      },
    });

    const { isEmailVerified, ...res } = user;

    return res;
  }

  async login(dto: UserLoginDTO): Promise<UserLoginResponse> {
    //проверка на наличие пользователя по логину
    const user = await db.users.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (!user) {
      throw ApiError.badRequest("Incorrect data (login)");
    }

    //провекрка пароля
    const isPasswordValid = bcrypt.compareSync(dto.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.badRequest("Incorrect data (password)");
    }

    //генерация токена
    const token = tokenService.generateToken<tokenPayload>({ id: user.id, roles: user.roles }, process.env.JWT_TOKEN_KEY as string, process.env.JWT_TOKEN_LIVETIME as string);

    return {
      token,
    };
  }

  async me(id: string): Promise<UserMeResponse> {
    const user = await db.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        roles: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw ApiError.notFound();
    }

    return user;
  }

  async changeRole(id: string, dto: UserRoleDTO): Promise<UserRoleResponse> {
    //проверка на наличие пользователя
    const user = await db.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw ApiError.notFound();
    }

    const roleNum = rolesService.generateRolesNum(dto.roles);

    const updatedUser = await db.users.update({
      where: {
        id,
      },
      data: {
        roles: roleNum,
      },
      select: {
        id: true,
        username: true,
        email: true,
        roles: true,
        isEmailVerified: true,
      },
    });

    return updatedUser;
  }

  async verifyEmail(token: string): Promise<void> {
    const payload = tokenService.validateToken<{ email: string }>(token, process.env.JWT_VERIFY_KEY as string);
    if (!payload) {
      throw ApiError.badRequest("Invalid token");
    }
    log(payload);
    const user = await db.users.update({
      where: {
        email: payload.email,
      },
      data: {
        isEmailVerified: true,
      },
    });
    return;
  }
}

export default new UserService();
