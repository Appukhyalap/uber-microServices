const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require("../models/blackListTokenModel");
const { subscribeToQueue } = require('../service/rabbit')
const EventEmitter = require('events');
const rideEventEmitter = new EventEmitter();

let register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "user already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ name, email, password: hash });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie('token', token);
        console.log("User registered successfully");
        return res.status(200).json({ token, newUser });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

let loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel
            .findOne({ email })
            .select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log("user logged in")
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        delete user._doc.password;

        res.cookie('token', token);

        res.send({ token, user });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }

}

let logout = async (req, res) => {
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        if (!token) {
            return res.status(400).json({ message: "No token found in request" });
        }
        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        console.log("User logged out successfully");
        res.send({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

let userProfile = async (req, res) => {
    try {
        res.send(req.user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

let acceptedRide = async (req, res) => {
    rideEventEmitter.once('ride-accepted', (data) => {
        res.send(data);
    });

    // Set timeout for long polling (e.g., 30 seconds)
    setTimeout(() => {
        res.status(204).send();
    }, 30000);
}

subscribeToQueue('ride-accepted', async (msg) => {
    const data = JSON.parse(msg);
    rideEventEmitter.emit('ride-accepted', data);
});

module.exports = {
    register,
    loginUser,
    logout,
    userProfile,
    acceptedRide,
}