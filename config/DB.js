require('dotenv').config();

const mongoose = require("mongoose");

// const connectionUrl = `mongodb+srv://${process.env.DB_USER_ID}:${process.env.DB_PASS}@todo-list.yqi65.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const connectionUrl = `mongodb://localhost:27017/Parcinfo?retryWrites=true&w=majority`

mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose.connection;
