import * as dotenv from "dotenv";
import express, { Express } from "express";

dotenv.config();

import { usersRouter } from "./users.routes";
import { fileRouter } from "./file.routes";

const app: Express = express();

app.use("/users", usersRouter);
app.use("/file", fileRouter);

export default app;
