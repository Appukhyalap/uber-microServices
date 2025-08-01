const express = require("express");
const { register, loginUser, logout, userProfile } = require("../controller/userControllers");
const { userAuth } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register" , register);
router.post("/login" , loginUser);
router.post("/logout" , logout);
router.get("/profile" , userAuth , userProfile);

module.exports = router;