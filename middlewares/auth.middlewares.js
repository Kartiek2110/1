const User = require('../models/users');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist.model');

module.exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        const isBlacklisted = await Blacklist.findOne({ token})
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        if (!token) {
            return res.status(401).json({ message: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports.isSeller = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role !== 'seller') {
            return res.status(403).json({ message: 'Unauthorized seller' });
        }
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Unauthorized seller' });
    }
};