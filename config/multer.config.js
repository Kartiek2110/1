const FirebaseStorage = require('multer-firebase-storage')
const Multer = require('multer')
const serviceCredentials = require("/etc/secrets/e-commerce-f0d8b-firebase-adminsdk-kxqw1-487e2995b7.json")
const fbAdmin = require("./firebase.config")

const storage = FirebaseStorage({
    bucketName: "e-commerce-f0d8b.appspot.com",
    credentials: fbAdmin.credential.cert(serviceCredentials),
    unique: true,
    public: true,
})

const upload = Multer({
    storage: storage
})

module.exports = upload