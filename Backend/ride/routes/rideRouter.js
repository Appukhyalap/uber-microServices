const express = require('express');
const { AuthUser, AuthCaptain } = require('../middleware/authMiddleware');
const { createRide, acceptride } = require('../controller/rideControlller');
const router = express.Router();

router.get('/' , (req , res) => {
    res.send('ride services');
});

router.post("/create-ride" , AuthUser , createRide)
router.put("/accept-ride" , AuthCaptain , acceptride)

module.exports = router;