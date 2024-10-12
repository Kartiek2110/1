const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Blacklist = require('../models/blacklist.model')
const Product = require('../models/product');
const Payment = require('../models/payment')
const Order = require('../models/order')
const Razorpay = require('razorpay');


var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                msg: 'Please fill in all fields'
            })
        }
        const isUserAlreadyExist = await User.findOne({ email })

        if (isUserAlreadyExist) {
            return res.status(400).json({
                msg: 'User already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            role
        })
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: "1hr" })
        res.status(201).json({
            message: 'User created',
            token,
            user
        })

    } catch (e) {
        next(e)
    }
}
module.exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                msg: 'Please provide email and password'
            })
        }
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                msg: 'Invalid credentials'
            })
        }
        // Corrected the password comparison logic to use bcrypt.compare for asynchronous comparison
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({
                msg: 'Password is incorrect'
            })
        }
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: "1hr" })
        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user
        })

    } catch (err) {
        next(err)
    }
}
module.exports.logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1] // Corrected the split method to split by space
        if (!token) {
            return res.status(400).json({
                message: 'Token is required'
            })
        }
        const isTokenBlacklisted = await Blacklist.findOne({ token })

        if (isTokenBlacklisted) {
            return res.status(400).json({
                message: 'Token is already blacklisted'
            })
        }
        await Blacklist.create({ token })

        res.status(200).json({
            message: 'Logged out successfully'
        })

    } catch (e) {
        next(e)
    }
}
module.exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        res.status(200).json({
            message: 'User Fected successfully',
            user
        })
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        res.json(user)
    } catch (err) {
        next(err)
    }
}
module.exports.getProducts = async (req, res, next) => {

    try {
        const products = await Product.find({})
        res.status(200).json({
            message: 'Products fetched successfully',
            products
        })
    }
    catch (err) {
        next(err)
    }
}
module.exports.getProductsbyId = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            return res.status(404).json({
                product
            })
        }
        res.json(product)
    } catch (err) {
        next(err)
    }
}

module.exports.createOrder = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const option = {
            amount: product.amount,
            currency: "INR",
            receipt: "product.id",
            payment_capture: 1
        }
        const order = await instance.orders.create(option)

        res.status(200).json({
            message: "Payment successful",
            order
        })
        const payment = await Payment.create({
            orderId: order.id,
            amount: product.amount,
            currency: "INR",
            status: "pending"
        })

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        next(error);
    }
}
module.exports.verifyPayment = async (req, res, next) => {

    try {
        const { paymedId, orderId, signature } = req.body
        const secret = process.env.RAZORPAY_KEY_SECRET

        const { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils.js')

        const isValid = validatePaymentVerification({
            paymedId: paymedId,
            orderId: orderId,
        }, signature, secret)
        if (isValid) {
            const payment = await Payment.findOne({
                orderId: orderId
            })
            payment.paymentId = paymentId
            payment.signature = signature
            payment.status = "paid"
            await payment.save()
            res.status(200).json({ message: "Payment verified successfully", payment })
        }
        else {
            const payment = await Payment.findOne({
                orderId: orderId
            })
            payment.status = "failed"
            res.status(400).json({ message: "Invalid payment verification" })
        }

    }
    catch (error) {
        next(error);
    }

}