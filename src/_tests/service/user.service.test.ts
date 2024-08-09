import { log } from "console";
import db from "../../db";
import tokenService from "../../services/token.service";
import userService from "../../services/user.service";
import ApiError from "../../utils/apiErrors";
import { tokenPayload } from "../../utils/interfaces";
import { rolesKeys } from "../../utils/variables/roles";

describe("user", () => {
  let prisma;

  beforeAll(async () => {
    jest.clearAllMocks();
    prisma = await db.$connect();
    await await db.users.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  describe("register", () => {
    it("should sucsesfully return user", async () => {
      const mockUserDTO = {
        email: "chertilla1337chzh@gmail.com",
        username: "valera",
        password: "1337",
      };

      const result = await userService.register(mockUserDTO);

      expect(result).toEqual({
        id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        username: "valera",
        password: expect.any(String),
        email: "chertilla1337chzh@gmail.com",
        roles: 1,
      });
    });

    it("should return error (email)", async () => {
      const mockUserDTO = {
        email: "chertilla1337chzh@gmail.com",
        username: "valera",
        password: "1337",
      };

      await expect(userService.register(mockUserDTO)).rejects.toThrow(ApiError.badRequest("User with this email already exists"));
    });

    it("should return error (username)", async () => {
      const mockUserDTO = {
        email: "chertilla1337chzh1@gmail.com",
        username: "valera",
        password: "1337",
      };

      await expect(userService.register(mockUserDTO)).rejects.toThrow(ApiError.badRequest("User with this username already exists"));
    });
  });

  describe("login", () => {
    it("login user", async () => {
      const mockUserDTO = {
        username: "valera",
        password: "1337",
      };

      await expect(userService.login(mockUserDTO)).resolves.toEqual({
        token: expect.any(String),
      });
    });

    it("invalid username", async () => {
      const mockUserDTO = {
        username: "valera1",
        password: "1337",
      };

      await expect(userService.login(mockUserDTO)).rejects.toThrow(ApiError.badRequest("Incorrect data (login)"));
    });

    it("invalid password", async () => {
      const mockUserDTO = {
        username: "valera",
        password: "13371",
      };

      await expect(userService.login(mockUserDTO)).rejects.toThrow(ApiError.badRequest("Incorrect data (password)"));
    });
  });

  describe("me", () => {
    it("get me info", async () => {
      const mockUserDTO = {
        username: "valera",
        password: "1337",
      };

      const { token } = await userService.login(mockUserDTO);
      const data = tokenService.validateToken<tokenPayload>(token, process.env.JWT_TOKEN_KEY as string);

      await expect(userService.me(data!.id)).resolves.toEqual({
        id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        username: "valera",
        email: "chertilla1337chzh@gmail.com",
        isEmailVerified: false,
        roles: 1,
      });
    });

    it("invalid id", async () => {
      await expect(userService.me("f6b0ca2a-4921-40a4-b97c-d7093f3ac62e")).rejects.toThrow(ApiError.notFound());
    });
  });

  describe("role", () => {
    it("change user role (+ admin)", async () => {
      const mockUserDTO = {
        username: "valera",
        password: "1337",
      };

      userService.login(mockUserDTO).then(async (data) => {
        const dataToken = tokenService.validateToken<tokenPayload>(data.token, process.env.JWT_TOKEN_KEY as string);
        const userId = dataToken!.id;

        const mockUserRoleDTO = {
          roles: ["admin", "user"] as rolesKeys[],
        };

        await expect(userService.changeRole(userId, mockUserRoleDTO)).resolves.toEqual({
          id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
          username: "valera",
          email: "chertilla1337chzh@gmail.com",
          isEmailVerified: false,
          roles: 3,
        });
      });
    });
  });
});
