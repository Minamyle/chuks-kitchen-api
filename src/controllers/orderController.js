const orders = require("../models/orderModel");
const foods = require("../models/foodModel");
const { v4: uuidv4 } = require("uuid");

// In-memory cart storage: { userId: [{ foodId, quantity }] }
const carts = {};

// Add item to cart
exports.addToCart = (req, res) => {
  const { userId, foodId, quantity } = req.body;

  if (!userId || !foodId || !quantity) {
    return res.status(400).json({ message: "userId, foodId, and quantity required" });
  }

  const food = foods.find(f => f.id === foodId && f.available);
  if (!food) return res.status(404).json({ message: "Food item not found or unavailable" });

  if (!carts[userId]) carts[userId] = [];
  const cart = carts[userId];

  // Check if item already in cart
  const existing = cart.find(item => item.foodId === foodId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ foodId, quantity });
  }

  res.json({ message: "Item added to cart", cart });
};

// View cart
exports.viewCart = (req, res) => {
  const userId = req.params.userId;
  const cart = carts[userId] || [];

  // Include food details
  const detailedCart = cart.map(item => {
    const food = foods.find(f => f.id === item.foodId);
    return {
      foodId: item.foodId,
      name: food?.name,
      price: food?.price,
      quantity: item.quantity,
      total: food?.price * item.quantity
    };
  });

  const totalPrice = detailedCart.reduce((sum, item) => sum + item.total, 0);

  res.json({ cart: detailedCart, totalPrice });
};

// Place order
exports.createOrder = (req, res) => {
  const { userId } = req.body;
  const cart = carts[userId];

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Validate items are still available
  for (const item of cart) {
    const food = foods.find(f => f.id === item.foodId && f.available);
    if (!food) {
      return res.status(400).json({ message: `Food item ${item.foodId} not found or unavailable` });
    }
  }

  const orderId = uuidv4();
  const orderItems = cart.map(item => {
    const food = foods.find(f => f.id === item.foodId);
    return {
      foodId: item.foodId,
      name: food.name,
      price: food.price,
      quantity: item.quantity
    };
  });

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const newOrder = {
    id: orderId,
    userId,
    items: orderItems,
    totalPrice,
    status: "Pending",
    createdAt: new Date()
  };

  orders.push(newOrder);

  // Clear cart
  carts[userId] = [];

  res.status(201).json({ message: "Order placed successfully", order: newOrder });
};

// Get order details
exports.getOrder = (req, res) => {
  const orderId = req.params.id;
  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order);
};

// Update order status
exports.updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  res.json({ message: "Order status updated", order });
};
