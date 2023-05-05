import { Router } from "express";
import { couponController } from "../controllers/couponController";
import { roleMiddleware } from "../middleware/roleMiddleware";
const couponRouter = Router();

couponRouter.post("/", roleMiddleware("ADMIN"), couponController.create);

couponRouter.get("/", roleMiddleware("ADMIN"), couponController.getAll);

couponRouter.patch("/:id", roleMiddleware("ADMIN"), couponController.update);

couponRouter.delete("/:id", roleMiddleware("ADMIN"), couponController.delete);

export { couponRouter };
