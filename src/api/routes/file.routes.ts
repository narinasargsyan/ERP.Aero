import express from "express";
import { filesController } from "../controller";
import authenticationMiddleware from "../middlewares/authentication.middleware";

const fileRouter = express.Router();

fileRouter.use(authenticationMiddleware.authenticate);

fileRouter.post("/upload", filesController.upload.single("file"), filesController.uploadFile);
fileRouter.get("/list", filesController.list);
fileRouter.delete("/delete/:id", filesController.deleteFile);
fileRouter.get("/download/:id", filesController.downloadFile);
fileRouter.get("/:id", filesController.getFileInfo);
fileRouter.put("/update/:id", filesController.upload.single("file"), filesController.updateFile);

export { fileRouter };
