const express = require("express");
const { captainlogin, captainlogout, captainProfile, captainRegister, toggleAvailability, WaitForNewRide} = require("../controller/captainControllers");
const { captainAuth } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register" , captainRegister);
router.post("/login" , captainlogin);
router.get("/logout" , captainAuth, captainlogout);
router.get("/profile" , captainAuth , captainProfile);
router.patch("/toggle-Availability" , captainAuth , toggleAvailability);
router.get("/new-ride" , captainAuth , WaitForNewRide);

module.exports = router;