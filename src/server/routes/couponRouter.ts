import { Router } from "express";
import { couponController } from "../controllers/couponController";
const couponRouter = Router();

couponRouter.post("/", couponController.create);

couponRouter.get("/", couponController.getAll);

couponRouter.patch("/:id", couponController.update);

couponRouter.delete("/:id", couponController.delete);

export { couponRouter };
