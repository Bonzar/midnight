import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
const userRouter = Router();
/**
 * User address
 */

userRouter.post("/address", userController.createAddress);

userRouter.patch("/address/:id", userController.updateAddress);

userRouter.delete("/address/:id", userController.deleteAddress);

/**
 * User its self
 */

userRouter.post("/registration", userController.registration);

userRouter.post("/login", userController.login);

userRouter.get("/auth", authMiddleware, userController.check);

export { userRouter };
