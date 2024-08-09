import express from "express";
import router from "./routes";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware";
import bcrypt from "bcryptjs";
import db from "./db";

export const createApp = () => {
  const app = express();

  //добавление первого админа
  db.$connect().then(async () => {
    const admin = await db.users.findUnique({
      where: {
        id: "11111111-1111-4111-8111-111111111111",
      },
    });

    if (admin) return;

    await db.users.create({
      data: {
        id: "11111111-1111-4111-8111-111111111111",
        email: "admin@gmail.com",
        username: "admin",
        password: bcrypt.hashSync("1337"),
        roles: 3,
        isEmailVerified: true,
      },
    });
  });

  app.use(express.json());
  app.use("/", router);
  app.use(errorHandlerMiddleware);

  return app;
};
