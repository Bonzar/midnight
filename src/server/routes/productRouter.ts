import { Router } from "express";
import { productController } from "../controllers/productController";
import { productImageController } from "../controllers/productImageController";
import { productMetaController } from "../controllers/productMetaController";
import { roleMiddleware } from "../middleware/roleMiddleware";

const productRouter = Router();

/**
 * Product Image
 */

// Create
productRouter.post(
  "/image",
  roleMiddleware(["ADMIN"]),
  productImageController.create
);

// Update
productRouter.patch(
  "/image/:id",
  roleMiddleware(["ADMIN"]),
  productImageController.update
);

// Update Many
productRouter.patch(
  "/image",
  roleMiddleware(["ADMIN"]),
  productImageController.updateMany
);

// Delete
productRouter.delete(
  "/image/:id",
  roleMiddleware(["ADMIN"]),
  productImageController.delete
);

/**
 * Product Meta
 */

// Create
productRouter.post(
  "/meta",
  roleMiddleware(["ADMIN"]),
  productMetaController.create
);

// Update
productRouter.patch(
  "/meta/:id",
  roleMiddleware(["ADMIN"]),
  productMetaController.update
);

// Delete
productRouter.delete(
  "/meta/:id",
  roleMiddleware(["ADMIN"]),
  productMetaController.delete
);

/**
 * Product its self
 */

// Create
productRouter.post("/", roleMiddleware(["ADMIN"]), productController.create);

// Get products list
productRouter.get("/", productController.getAll);

// Get detailed product
productRouter.get("/:id", productController.get);

// Update
productRouter.patch(
  "/:id",
  roleMiddleware(["ADMIN"]),
  productController.update
);

// Delete
productRouter.delete(
  "/:id",
  roleMiddleware(["ADMIN"]),
  productController.delete
);

export { productRouter };
