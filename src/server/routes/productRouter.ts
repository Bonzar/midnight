import { Router } from "express";
import { productController } from "../controllers/productController";
import { productImageController } from "../controllers/productImageController";
import { productMetaController } from "../controllers/productMetaController";
const productRouter = Router();

/**
 * Product Image
 */

productRouter.post("/image", productImageController.create);
productRouter.patch("/image/:id", productImageController.update);
productRouter.patch("/image", productImageController.updateMany);
productRouter.delete("/image/:id", productImageController.delete);

/**
 * Product Meta
 */

productRouter.post("/meta", productMetaController.create);
productRouter.patch("/meta/:id", productMetaController.update);
productRouter.delete("/meta/:id", productMetaController.delete);

/**
 * Product its self
 */

productRouter.post("/", productController.create);

productRouter.get("/", productController.getAll);

productRouter.get("/:id", productController.get);

productRouter.patch("/:id", productController.update);

productRouter.delete("/:id", productController.delete);

export { productRouter };
