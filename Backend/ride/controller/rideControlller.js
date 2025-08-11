const rideModel = require("../models/rideModel");
const {subscribeToQueue , publishToQueue} = require("../service/rabbit");

let createRide = async(req, res) => {
    try{
        const {pickup , destination} = req.body;

    const newRide = await rideModel.create({
        user: req.user._id,
        pickup,
        destination,
    });

    await newRide.save();
    publishToQueue("new-ride" , JSON.stringify(newRide));
    res.send(newRide);
    }
    catch(err) {
        return res.status(500).json({ message: err.message });
    }
}

let acceptride = async(req , res) => {
    const {rideId} = req.query;
    const ride = await rideModel.findOne({_id: rideId});
    if(!ride) {
        return res.status(400).json({Message:  "ride not found"});
    }
    ride.status = "accepted";
    await ride.save();
    publishToQueue("ride-accepted" , JSON.stringify(ride));
    res.send(ride);
}

module.exports = {
    createRide,
    acceptride
}