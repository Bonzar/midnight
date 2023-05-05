import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
const userRouter = Router();

/**
 * User address
 */

userRouter.post("/address", authMiddleware, userController.createAddress);

userRouter.patch("/address/:id", authMiddleware, userController.updateAddress);

userRouter.delete("/address/:id", authMiddleware, userController.deleteAddress);

/**
 * User its self
 */

userRouter.post("/registration", userController.registration);

userRouter.post("/login", userController.login);

userRouter.post("/logout", authMiddleware, userController.logout);

userRouter.get("/activate/:link", userController.activate);

userRouter.get("/refresh", authMiddleware, userController.refresh);

export { userRouter };
