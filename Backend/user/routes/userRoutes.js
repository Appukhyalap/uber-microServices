const express = require("express");
const { register, loginUser, logout, userProfile, acceptedRide } = require("../controller/userControllers");
const { userAuth } = require("../middleware/authMiddleware");
const { AuthUser } = require("../../ride/middleware/authMiddleware");
const router = express.Router();

router.post("/register" , register);
router.post("/login" , loginUser);
router.get("/logout" , logout);
router.get("/profile" , userAuth , userProfile);
router.get("/accepted-ride" , userAuth , acceptedRide);

module.exports = router;