import { log } from "console";
import * as dotenv from "dotenv";
dotenv.config();
import { createApp } from "./createApp";
import { PrismaClient } from "@prisma/client";
import db from "./db";

const app = createApp();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = db;

const bootstrap = async () => {
  await client.$connect();
  app.listen(process.env.PORT, () => {
    log(`Server started on port ${process.env.PORT}`);
  });
};

bootstrap();
