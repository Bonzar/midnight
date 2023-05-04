import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import { checkRoleMiddleware } from "../middleware/checkRoleMiddleware";
const categoryRouter = Router();

categoryRouter.post(
  "/",
  checkRoleMiddleware("ADMIN"),
  categoryController.create
);

categoryRouter.get("/", categoryController.getAll);

categoryRouter.patch("/:id", categoryController.update);

categoryRouter.delete("/:id", categoryController.delete);

export { categoryRouter };
