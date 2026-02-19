const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

router.get("/foods", foodController.getFoods);
router.post("/foods", foodController.addFood);

module.exports = router;