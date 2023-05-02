import { Router } from "express";
import { basketController } from "../controllers/basketController";
const basketRouter = Router();

basketRouter.post("/product", basketController.addProduct);
basketRouter.patch("/product", basketController.updateProduct);
basketRouter.delete("/product", basketController.deleteProduct);

basketRouter.post("/coupon", basketController.addCoupon);
basketRouter.delete("/coupon", basketController.deleteCoupon);

export { basketRouter };
