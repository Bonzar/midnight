import { Router } from "express";
import { orderController } from "../controllers/orderController";
const orderRouter = Router();

orderRouter.post("/", orderController.create);

orderRouter.get("/:id", orderController.get);

orderRouter.patch("/:id", orderController.update);

orderRouter.delete("/:id", orderController.update);

export { orderRouter };
