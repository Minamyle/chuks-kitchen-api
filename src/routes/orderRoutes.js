const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Cart endpoints
router.post("/cart", orderController.addToCart);
router.get("/cart/:userId", orderController.viewCart);

// Orders endpoints
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrder);
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
