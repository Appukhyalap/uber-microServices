const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("ride service connected to db");
}).catch(err => {
    console.log(err);
})

module.exports = mongoose.Connection;