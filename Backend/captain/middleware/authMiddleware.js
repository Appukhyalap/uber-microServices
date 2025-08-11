const jwt = require('jsonwebtoken');
const captainModel = require('../models/captainModel');
const blacklistTokenModel = require('../models/blackListTokenModel');

let captainAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - no token' });
        }

        const isBlacklisted = await blacklistTokenModel.findOne({ token });

        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized - blacklisted token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainModel.findOne({ _id: decoded.id });

        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized - user not found' });
        }

        req.captain = captain;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    captainAuth
}