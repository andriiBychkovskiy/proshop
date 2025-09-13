import { Router } from "express";
import {
  addOrderItems,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getAllOrders);

router.route("/myorders").get(protect, getMyOrders);

router.route("/:id").get(protect, getOrderById);

router.route("/:id/delivered").put(protect, admin, updateOrderToDelivered);

router.route("/:id/pay").put(protect, updateOrderToPaid);

export default router;
