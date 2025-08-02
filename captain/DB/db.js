const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('captain service connected to MongoDB');
}).catch(err => {
    console.log(err);
});


module.exports = mongoose.Connection;