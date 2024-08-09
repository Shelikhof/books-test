import Joi from "joi";
import { ROLES, rolesKeys } from "../utils/variables/roles";

// /users/register
export interface UserRegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface UserRegisterResponse extends UserRegisterDTO {
  id: string;
  roles: number;
}

export const UserRegisterSchema = Joi.object<UserRegisterDTO>({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// /users/login
export interface UserLoginDTO {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
}

export const UserLoginSchema = Joi.object<UserLoginDTO>({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// /users/me
export interface UserMeResponse {
  id: string;
  username: string;
  email: string;
  roles: number;
  isEmailVerified: boolean;
}

// /users/:id/role
export interface UserRoleDTO {
  roles: rolesKeys[];
}

export interface UserRoleResponse extends UserMeResponse {}

export const UserRoleSchema = Joi.object<UserRoleDTO>({
  roles: Joi.array()
    .items(Joi.string().valid(...Object.keys(ROLES)))
    .required(),
});
