const fbAdmin = require("firebase-admin")
const serviceCredentials = require("/etc/secrets/e-commerce-f0d8b-firebase-adminsdk-kxqw1-487e2995b7.json")



fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceCredentials),
    storageBucket: "e-commerce-f0d8b.appspot.com"
})

module.exports = fbAdmin