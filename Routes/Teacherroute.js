const express = require("express");
const { Upload, removeFile } = require("../Controller/CloudinaryController");
const {
  login,
  verifyOtp,
  verifySession,
  signUp,
  verifyOtppasscode,
  forgotPassword,
  resetPassword,
} = require("../Controller/TeacherController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { schedulePaper } = require("../Controller/PaperController");

const router = express.Router();

router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/signup", signUp);
router.post("/verifypasscode", verifyOtppasscode);
router.post("/verify-session", verifySession);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/upload", upload.single('file'), Upload);
router.post("/remove-file", removeFile)
router.post("/schedule-paper", schedulePaper);


module.exports = router;
