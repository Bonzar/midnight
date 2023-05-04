import { Router } from "express";
import { shipmentController } from "../controllers/shipmentController";
const shipmentRouter = Router();

shipmentRouter.post("/", shipmentController.createType);

shipmentRouter.get("/", shipmentController.getAllTypes);

shipmentRouter.patch("/:id", shipmentController.updateType);

shipmentRouter.delete("/:id", shipmentController.deleteType);

export { shipmentRouter };
