const express = require('express');
const Product = require("../models/product")
const upload = require("../config/multer.config");
const authMiddleware = require('../middlewares/auth.middlewares');
const router = express.Router()
const productController = require("../controllers/product.controller")


router.use(authMiddleware.isAuthenticated).use(authMiddleware.isSeller);
router.post('/create-products', upload.any(), productController.createProduct)

module.exports = router