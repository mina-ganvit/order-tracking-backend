import { Router } from "express";
import {
  createOrder,
  updateOrder,
  getAllOrders,
} from "../controller/order.controller";
import { authorization } from "../middleware/authentication";
const router = Router();

router.post("/", authorization, createOrder);
router.put("/:id", authorization, updateOrder);
router.get("/", authorization, getAllOrders);
export default router;
