import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
const categoryRouter = Router();

categoryRouter.post("/", categoryController.create);

categoryRouter.get("/", categoryController.getAll);

categoryRouter.patch("/:id", categoryController.update);

categoryRouter.delete("/:id", categoryController.delete);

export { categoryRouter };
