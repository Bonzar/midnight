import { Router } from "express";
import { shipmentController } from "../controllers/shipmentController";
import { roleMiddleware } from "../middleware/roleMiddleware";

const shipmentRouter = Router();

shipmentRouter.post(
  "/",
  roleMiddleware(["ADMIN"]),
  shipmentController.createType
);

shipmentRouter.get("/", shipmentController.getAllTypes);

shipmentRouter.patch(
  "/:id",
  roleMiddleware(["ADMIN"]),
  shipmentController.updateType
);

shipmentRouter.delete(
  "/:id",
  roleMiddleware(["ADMIN"]),
  shipmentController.deleteType
);

export { shipmentRouter };
