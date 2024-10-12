const mongoose = require('mongoose')

const connectDB = function () {

    try {
        mongoose.connect(process.env.MONGO_URI).then(() => {

            console.log("Mongoose Connected")
        }).catch((err) => {
            console.error(err.message)

        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB