import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { userRouter } from "./userRouter";
import { categoryRouter } from "./categoryRouter";
import { orderRouter } from "./orderRouter";
import { couponRouter } from "./couponRouter";
import { productRouter } from "./productRouter";
import { basketRouter } from "./basketRouter";
import { shipmentRouter } from "./shipmentRouter";
import { wishlistRouter } from "./wishlistRouter";
import { ApiError } from "../error/ApiError";

const router = Router();

router.use("/user", userRouter); // user + address
router.use("/category", categoryRouter);
router.use("/order", orderRouter); // order + shipmentType
router.use("/coupon", roleMiddleware(["ADMIN"]), couponRouter);
router.use("/product", productRouter);
router.use("/basket", authMiddleware, basketRouter);
router.use("/wishlist", authMiddleware, wishlistRouter);
router.use("/shipment", shipmentRouter);

router.use("/*", (req, res, next) => next(ApiError.notFound()));

export { router };
