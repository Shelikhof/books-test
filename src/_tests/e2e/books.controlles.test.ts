import request from "supertest";
import { createApp } from "../../createApp";
import { type Express } from "express-serve-static-core";
import db from "../../db";
import { log } from "console";

describe("user controller", () => {
  let app: Express;
  let adminToken: string;
  let id: string;

  beforeAll(async () => {
    await db.$connect();
    await db.books.deleteMany();
    app = createApp();

    const data = await request(app).post("/users/login").send({
      username: "admin",
      password: "1337",
    });

    adminToken = data.body.token;
    log(adminToken);
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  describe("create book", () => {
    it("should sucsesfully return book", async () => {
      const mockBookDTO = {
        title: "test",
        author: "bobrik",
        publicationDate: "2000.11.11",
        genres: ["scary", "strashilka"],
      };

      const res = await request(app).post("/books").set("Authorization", `Bearer ${adminToken}`).send(mockBookDTO);

      id = res.body.id;

      expect(res.status).toEqual(201);
      expect(res.body).toEqual({
        id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        title: "test",
        author: "bobrik",
        publicationDate: new Date("2000.11.11").toISOString(),
        genres: ["scary", "strashilka"],
      });
    });

    it("check validation dto", async () => {
      const mockBookDTO = {
        author: "bobrik",
        publicationDate: "2000.11.11",
        genres: ["scary", "strashilka"],
      };

      const res = await request(app).post("/books").set("Authorization", `Bearer ${adminToken}`).send(mockBookDTO);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({ message: `"title" is required` });
    });

    it("invalid token", async () => {
      const res = await request(app).post("/books").set("Authorization", `Bearer byp`);
      expect(res.status).toEqual(401);
      expect(res.body).toEqual({
        message: "User is not authorized",
      });
    });
  });

  describe("get books", () => {
    it("should sucsesfully return books", async () => {
      const res = await request(app).get("/books");
      expect(res.status).toEqual(200);
      expect(res.body).toEqual([
        {
          id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
          title: "test",
          author: "bobrik",
          publicationDate: new Date("2000.11.11").toISOString(),
          genres: ["scary", "strashilka"],
        },
      ]);
    });
  });

  describe("get book by id", () => {
    it("should sucsesfully return book", async () => {
      const res = await request(app).get(`/books/${id}`);
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        title: "test",
        author: "bobrik",
        publicationDate: new Date("2000.11.11").toISOString(),
        genres: ["scary", "strashilka"],
      });
    });

    it("not found", async () => {
      const res = await request(app).get(`/books/f6b0ca2a-4921-40a4-b97c-d7093f3ac62e`);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        message: "Not found",
      });
    });

    it("invalid id", async () => {
      const res = await request(app).get(`/books/1`);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        message: "Invalid book id",
      });
    });
  });

  describe("update book", () => {
    it("should sucsesfully return book", async () => {
      const mockBookDTO = {
        title: "test1",
        author: "bobrik",
        publicationDate: "2000.11.11",
        genres: ["scary", "strashilka1"],
      };

      const result = await request(app).put(`/books/${id}`).set("Authorization", `Bearer ${adminToken}`).send(mockBookDTO);
      expect(result.status).toEqual(200);
      expect(result.body).toEqual({
        id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        title: "test1",
        author: "bobrik",
        publicationDate: new Date("2000.11.11").toISOString(),
        genres: ["scary", "strashilka1"],
      });
    });

    it("should sucsesfully return error", async () => {
      const mockBookDTO = {
        title: "test1",
        author: "bobrik",
        publicationDate: "2000.11.11",
        genres: ["scary", "strashilka1"],
      };

      const result = await request(app).put(`/books/${id}`).set("Authorization", `Bearer 1`).send(mockBookDTO);
      expect(result.status).toEqual(401);
      expect(result.body).toEqual({
        message: "User is not authorized",
      });
    });
  });

  describe("delete book", () => {
    it("should sucsesfully delete book", async () => {
      const result = await request(app).delete(`/books/${id}`).set("Authorization", `Bearer ${adminToken}`);
      expect(result.status).toEqual(200);

      const res = await request(app).get(`/books/${id}`);
      expect(res.status).toEqual(404);
      expect(res.body).toEqual({
        message: "Not found",
      });
    });
  });
});
