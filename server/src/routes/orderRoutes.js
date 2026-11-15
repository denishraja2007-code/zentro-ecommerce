const router = require("express").Router();
const {
  createOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.put("/:id/cancel", protect, cancelOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;