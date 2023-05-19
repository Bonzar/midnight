import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const orderRouter = Router();

orderRouter.post("/", authMiddleware, orderController.create);

orderRouter.get("/", authMiddleware, orderController.getAll);

orderRouter.get("/:id", authMiddleware, orderController.get);

orderRouter.patch("/:id", roleMiddleware(["ADMIN"]), orderController.update);

orderRouter.delete("/:id", roleMiddleware(["ADMIN"]), orderController.delete);

export { orderRouter };
