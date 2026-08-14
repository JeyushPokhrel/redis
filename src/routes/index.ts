import { Router } from "express";
import productRoutes from "./product.routes";
import notificationRoute from "./notification.route"
const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    data: {
      status: "ok",
    },
  });
});

router.use("/products", productRoutes);
router.use("/notifications", notificationRoute);

export default router;
