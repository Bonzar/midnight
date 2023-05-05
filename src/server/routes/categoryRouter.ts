import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import { roleMiddleware } from "../middleware/roleMiddleware";

const categoryRouter = Router();

categoryRouter.post("/", roleMiddleware("ADMIN"), categoryController.create);

categoryRouter.get("/", categoryController.getAll);

categoryRouter.patch(
  "/:id",
  roleMiddleware("ADMIN"),
  categoryController.update
);

categoryRouter.delete(
  "/:id",
  roleMiddleware("ADMIN"),
  categoryController.delete
);

export { categoryRouter };
