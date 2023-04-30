import { Router } from "express";
import { userController } from "../controllers/userController";
const userRouter = Router();

userRouter.post("/registration", userController.registration);

userRouter.post("/login", userController.login);

userRouter.get("/auth", userController.check);

export { userRouter };
