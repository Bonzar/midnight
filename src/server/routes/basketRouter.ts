import { Router } from "express";
import { basketController } from "../controllers/basketController";
import { authMiddleware } from "../middleware/authMiddleware";
const basketRouter = Router();

/**
 * Basket product
 */

basketRouter.post("/product", authMiddleware, basketController.addProduct);

basketRouter.patch("/product", authMiddleware, basketController.updateProduct);

basketRouter.delete("/product", authMiddleware, basketController.deleteProduct);

/**
 * Basket coupon
 */

basketRouter.post("/coupon", authMiddleware, basketController.addCoupon);

basketRouter.delete("/coupon", authMiddleware, basketController.deleteCoupon);

/**
 * Basket itself
 */

basketRouter.get("/:id", authMiddleware, basketController.getBasket);

export { basketRouter };
