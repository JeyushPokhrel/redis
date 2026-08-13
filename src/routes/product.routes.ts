import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { productRateLimitter } from "../middleware/rateLimitter.middleware";

const router = Router();
router.use(productRateLimitter);

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProduct);

export default router;
