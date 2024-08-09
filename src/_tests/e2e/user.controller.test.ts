import request from "supertest";
import { createApp } from "../../createApp";
import { type Express } from "express-serve-static-core";
import db from "../../db";
import { tokenPayload } from "../../utils/interfaces";
import tokenService from "../../services/token.service";

describe("user controller", () => {
  let app: Express;

  beforeAll(async () => {
    await db.$connect();
    await db.users.deleteMany();
    app = createApp();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  describe("/users/register", () => {
    it("successful registration", async () => {
      const mockUserDTO = {
        email: "chertilla1337chzh@gmail.com",
        username: "valera",
        password: "1337",
      };

      const res = await request(app).post("/users/register").send(mockUserDTO);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
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

      const res = await request(app).post("/users/register").send(mockUserDTO);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({ message: "User with this email already exists" });
    });

    it("should return error (username)", async () => {
      const mockUserDTO = {
        email: "1chertilla1337chzh@gmail.com",
        username: "valera",
        password: "1337",
      };

      const res = await request(app).post("/users/register").send(mockUserDTO);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({ message: "User with this username already exists" });
    });

    it("check validation dto", async () => {
      const mockUserDTO = {
        username: "valera",
        password: "1337",
      };

      const res = await request(app).post("/users/register").send(mockUserDTO);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({ message: `"email" is required` });
    });
  });

  describe("/users/login", () => {
    it("successful login", async () => {
      const mockUserDTO = {
        username: "valera",
        password: "1337",
      };

      const res = await request(app).post("/users/login").send(mockUserDTO);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        token: expect.any(String),
      });
    });

    it("incorrect login", async () => {
      const mockUserDTO = {
        username: "valera1",
        password: "1337",
      };

      const res = await request(app).post("/users/login").send(mockUserDTO);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: "Incorrect data (login)",
      });
    });

    it("incorrect password", async () => {
      const mockUserDTO = {
        username: "valera",
        password: "13371",
      };

      const res = await request(app).post("/users/login").send(mockUserDTO);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: "Incorrect data (password)",
      });
    });
  });

  describe("me", () => {
    it("get me info", async () => {
      const mockUserDTO = {
        username: "valera",
        password: "1337",
      };

      await request(app)
        .post("/users/login")
        .send(mockUserDTO)
        .then(async (data) => {
          const res = await request(app).get("/users/me").set("Authorization", `Bearer ${data.body.token}`);
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({
            id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
            username: "valera",
            email: "chertilla1337chzh@gmail.com",
            isEmailVerified: false,
            roles: 1,
          });
        });
    });

    it("invalid token", async () => {
      const res = await request(app).get("/users/me").set("Authorization", `Bearer byp`);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        message: "User is not authorized",
      });
    });
  });

  describe("role", () => {
    it("change role", async () => {
      const mockAdmin = {
        username: "admin",
        password: "1337",
      };

      const user = await db.users.findUnique({
        where: {
          username: "valera",
        },
        select: {
          id: true,
        },
      });

      await request(app)
        .post("/users/login")
        .send(mockAdmin)
        .then(async (data) => {
          const res = await request(app)
            .put(`/users/${user?.id}/role`)
            .set("Authorization", `Bearer ${data.body.token}`)
            .send({ roles: ["admin", "user"] });
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({
            id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
            username: "valera",
            email: "chertilla1337chzh@gmail.com",
            isEmailVerified: false,
            roles: 3,
          });
        });
    });

    it("change role again", async () => {
      const mockAdmin = {
        username: "valera",
        password: "1337",
      };

      const user = await db.users.findUnique({
        where: {
          username: "valera",
        },
        select: {
          id: true,
        },
      });

      await request(app)
        .post("/users/login")
        .send(mockAdmin)
        .then(async (data) => {
          const res = await request(app)
            .put(`/users/${user?.id}/role`)
            .set("Authorization", `Bearer ${data.body.token}`)
            .send({ roles: ["user"] });
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({
            id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
            username: "valera",
            email: "chertilla1337chzh@gmail.com",
            isEmailVerified: false,
            roles: 1,
          });
        });
    });

    it("access denied", async () => {
      const mockAdmin = {
        username: "valera",
        password: "1337",
      };

      const user = await db.users.findUnique({
        where: {
          username: "valera",
        },
        select: {
          id: true,
        },
      });

      await request(app)
        .post("/users/login")
        .send(mockAdmin)
        .then(async (data) => {
          const res = await request(app)
            .put(`/users/${user?.id}/role`)
            .set("Authorization", `Bearer ${data.body.token}`)
            .send({ roles: ["admin", "user"] });
          expect(res.status).toEqual(403);
          expect(res.body).toEqual({
            message: "Access is denied",
          });
        });
    });
  });
});
