import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
const categoryRouter = Router();

categoryRouter.post("/", categoryController.create);

categoryRouter.get("/", categoryController.get);

categoryRouter.patch("/:id", categoryController.update);

categoryRouter.delete("/:id", categoryController.delete);

export { categoryRouter };
