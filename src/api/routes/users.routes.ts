import * as express from "express";
import { userController } from "../controller";
import authenticationMiddleware from "../middlewares/authentication.middleware";
import { validateSchema } from "../validations";

const usersRouter = express.Router();

usersRouter.post("/sign-up", validateSchema("signUpUserSchema"), userController.signUp);
usersRouter.post("/sign-in", validateSchema("signInUserSchema"), userController.signIn);
usersRouter.post("/sign-in/new_token", validateSchema("refreshAccessTokenSchema"), userController.refreshAccessToken);

usersRouter.use(authenticationMiddleware.authenticate);
usersRouter.get("/info", userController.info.bind(userController));
usersRouter.get("/logout", userController.logout);

export { usersRouter };
