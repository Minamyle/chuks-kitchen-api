const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post("/signup", userController.signup);
router.post("/verify", userController.verify);

module.exports = router;