import { Router } from "express";
import { wishlistController } from "../controllers/wishlistController";
const wishlistRouter = Router();

/**
 * Wishlist product
 */

wishlistRouter.post("/product", wishlistController.addProduct);

wishlistRouter.delete("/product", wishlistController.deleteProduct);

/**
 * Wishlist itself
 */

wishlistRouter.get("/", wishlistController.getWishlist);

export { wishlistRouter };
