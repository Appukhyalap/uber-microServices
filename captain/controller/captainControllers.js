const captainModel = require("../models/captainModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require("../models/blackListTokenModel");
const {subscribeToQueue} = require("../service/rabbit")

const pendingRequests = [];

let captainRegister = async(req , res) => {
    try {
        const { name, email, password } = req.body;
        const captain = await captainModel.findOne({ email });

        if (captain) {
            return res.status(400).json({ message: 'captain already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const newcaptain = new captainModel({ name, email, password: hash });

        await newcaptain.save();

        const token = jwt.sign({ id: newcaptain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token);

        delete newcaptain._doc.password;

        res.send({ token, newcaptain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

let captainlogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const captain = await captainModel
            .findOne({ email })
            .select('+password');

        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, captain.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log("logged iN succesfully..")
        const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        delete captain._doc.password;

        res.cookie('token', token);

        res.send({ token, captain });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }

}

let captainlogout = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: "No token found in request" });
        }

        await blacklistTokenModel.create({ token });

        res.clearCookie('token');

        res.send({ message: 'Captain logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


let captainProfile = async(req , res) => {
    try {
        res.send(req.captain);
        console.log("welcom to captain profile");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

let toggleAvailability = async(req , res) => {
    try{
        const captain = await captainModel.findById(req.captain._id);
        captain.isAvailable = !captain.isAvailable
        await captain.save();
        res.send(captain);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

let WaitForNewRide = async(req, res) => {
    req.setTimeout(30000, () => {
        res.status(204).end(); // No Content
    });

    // Add the response object to the pendingRequests array
    pendingRequests.push(res);
}

subscribeToQueue("new-ride" , (data) => {
    const rideData = JSON.parse(data);

    // Send the new ride data to all pending requests
    pendingRequests.forEach(res => {
        res.json({data: rideData});
    });

    // Clear the pending requests
    pendingRequests.length = 0;
});

module.exports = {
    captainRegister,
    captainlogin,
    captainlogout,
    captainProfile,
    toggleAvailability,
    WaitForNewRide
}