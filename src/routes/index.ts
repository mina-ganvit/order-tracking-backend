import { Router } from "express";

const router = Router();

import userRouter from "./user.routes";
import orderRouter from "./order.routes";

router.use("/users", userRouter);
router.use("/orders", orderRouter);
export default router;
