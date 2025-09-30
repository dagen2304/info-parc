require('dotenv').config();

const mongoose = require("mongoose");

 const connectionUrl = `mongodb+srv://${process.env.DB_USER_ID}:${process.env.DB_PASS}@ktc-cls.e8tgmud.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=ktc-cls`
//const connectionUrl = `mongodb://localhost:27017/Parcinfo?retryWrites=true&w=majority`

mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose.connection;
