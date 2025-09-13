import { Router, type Request, type Response } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  createProductReview,
  updateProduct,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/top").get(getTopProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route("/:id/reviews").post(protect, createProductReview);

export default router;
