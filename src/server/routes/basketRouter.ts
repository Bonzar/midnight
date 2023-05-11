import { Router } from "express";
import { basketController } from "../controllers/basketController";
const basketRouter = Router();

/**
 * Basket product
 */

basketRouter.post("/product", basketController.addProduct);

basketRouter.patch("/product", basketController.updateProduct);

basketRouter.delete("/product", basketController.deleteProduct);

/**
 * Basket coupon
 */

basketRouter.post("/coupon", basketController.addCoupon);

basketRouter.delete("/coupon", basketController.deleteCoupon);

/**
 * Basket itself
 */

basketRouter.get("/", basketController.getBasket);

export { basketRouter };
