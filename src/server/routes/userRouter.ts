import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authController } from "../controllers/authController";
import { roleMiddleware } from "../middleware/roleMiddleware";

const userRouter = Router();

/**
 * User address
 */

userRouter.post("/address", authMiddleware, userController.createAddress);

userRouter.get("/address/:id", authMiddleware, userController.getAddress);

userRouter.patch("/address/:id", authMiddleware, userController.updateAddress);

userRouter.delete("/address/:id", authMiddleware, userController.deleteAddress);

/**
 * User Auth
 */

userRouter.post("/registration", authController.registration);

userRouter.post("/login", authController.login);

userRouter.post(
  "/logout",
  roleMiddleware(["GUEST"], { invertSelection: true }),
  authController.logout
);

userRouter.get("/activate/:link", authController.activate);

userRouter.get("/refresh", authController.refresh);

/**
 * User its self
 */

userRouter.get("/", authMiddleware, userController.getUser);

userRouter.patch("/", authMiddleware, userController.updateUser);

export { userRouter };
