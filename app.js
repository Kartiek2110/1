require("dotenv").config()
const cors = require('cors')
const express = require('express');
const app = express();
app.use(cors({
    origin: 'http://localhost:3000/',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }));
const connectDB = require('./config/db')
const indexRoutes = require('./routes/index.routes')
const userRoutes = require('./routes/user.routes')
const productRoutes = require('./routes/product.routes')
connectDB()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/",indexRoutes);
app.use("/user", userRoutes);
app.use("/product",productRoutes); 


app.listen(3000)