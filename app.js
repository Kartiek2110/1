require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const indexRoutes = require('./routes/index.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');

// Connect to database
connectDB();

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000', // Removed trailing slash
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers if necessary
}));

// Express middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);

// Error handling middleware for better debugging
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server on a different port (5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
