import { Router } from "express";
import { productController } from "../controllers/productController";
import { productImageController } from "../controllers/productImageController";
const productRouter = Router();

/**
 * Product Image
 */

productRouter.post("/image", productImageController.create);

/**
 * Product its self
 */

productRouter.post("/", productController.create);

productRouter.get("/", productController.getAll);

productRouter.get("/:id", productController.get);

productRouter.patch("/:id", productController.update);

productRouter.delete("/:id", productController.delete);

export { productRouter };
