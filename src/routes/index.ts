import { Router } from "express";
import usersRouter from "./users";
import booksRouter from "./books";

const router = Router();

router.use("/users", usersRouter);
router.use("/books", booksRouter);

export default router;
