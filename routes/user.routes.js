const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middlewares")

router.post("/signup", userController.signup)
router.post("/login", userController.signin)
router.post("/logout", userController.logout)
router.get("/profile",authMiddleware.isAuthenticated, userController.getProfile)

router.get('/products', authMiddleware.isAuthenticated, userController.getProducts)
router.get('/product/:id', authMiddleware.isAuthenticated, userController.getProductsbyId)
router.get('/order/:id', authMiddleware.isAuthenticated, userController.createOrder)
router.get('/verify/:id', authMiddleware.isAuthenticated, userController.verifyPayment)


module.exports = router;