const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("user service connected to atlas db");
}).catch((err) => {
    console.log(err);
})

module.exports = mongoose.connection;