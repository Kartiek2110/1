const Product = require("../models/product")


exports.createProduct = async function (req, res, next) {
    try {
        const { name, description, price } = req.body
        const images = req.files.map(file => file.publicUrl).filter(url => url ? true : false)

        

        if (!name || !description || !price) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const product = new Product({
            name,
            price,
            description,
            image: images,
            seller: req.user._id
        })
        await product.save()
        res.status(201).json({ message: "Product created successfully", product })
    } catch (error) {
        next(error)
    }
}



