const express = require("express");
const {
  login,
  verifyOtp,
  verifySession,
  signUp,
  verifyOtppasscode,
  forgotPassword,
  resetPassword,
  updateTeacherDetails,
} = require("../Controller/TeacherController");
const { schedulePaper } = require("../Controller/PaperController");

const router = express.Router();

router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/signup", signUp);
router.post("/verifypasscode", verifyOtppasscode);
router.post("/verify-session", verifySession);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/schedule-paper", schedulePaper);
router.post("/update-details", updateTeacherDetails);

module.exports = router;
