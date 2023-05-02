import { Router } from "express";
import { userRouter } from "./userRouter";
import { categoryRouter } from "./categoryRouter";
import { orderRouter } from "./orderRouter";
import { couponRouter } from "./couponRouter";
import { productRouter } from "./productRouter";
import { basketRouter } from "./basketRouter";

const router = Router();

router.use("/user", userRouter); // user + address
router.use("/category", categoryRouter);
router.use("/order", orderRouter); // order + shipmentType
router.use("/coupon", couponRouter);
router.use("/product", productRouter);
router.use("/basket", basketRouter);

router.use("/*", (req, res) => res.status(404).end());

export { router };
