const foods = require("../models/foodModel");
const { v4: uuidv4 } = require("uuid");

exports.getFoods = (req, res) => {
  res.json(foods);
};
exports.addFood = (req, res) => {
  const foodItems = req.body; // body is expected to be an array

  if (!Array.isArray(foodItems)) {
    return res.status(400).json({ message: "Send an array of food items" });
  }

  const addedFoods = [];

  for (const item of foodItems) {
    const { name, price, available } = item;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price required for all items" });
    }

    const newFood = {
      id: uuidv4(),
      name,
      price,
      available: available ?? true,
    };

    foods.push(newFood);
    addedFoods.push(newFood);
  }

  res.status(201).json({
    message: "Food items added successfully",
    foods: addedFoods,
  });
};
