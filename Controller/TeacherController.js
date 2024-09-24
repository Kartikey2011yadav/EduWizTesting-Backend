const Teacher = require("../Models/Teacher");
const UnverifiedTeacher = require("../Models/UnverifiedTeacher");
const {
  sendOtpToEmail,
  sendResetLinkToEmail,
} = require("../config/nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const signUp = async (req, res) => {
  const { name, email, mobileNumber, password } = req.body;

  try {
    const existingTeacher = await UnverifiedTeacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 2 * 24 * 60 * 60 * 1000; //2days

    const newTeacher = new UnverifiedTeacher({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await newTeacher.save();

    // Custom text for the email sent to the admin
    const customText = `${name} is trying to sign up. His email is ${email} and the OTP is ${otp}.`;

    // Send OTP to admin
    await sendOtpToEmail(process.env.ADMIN_EMAIL, otp, customText);

    res
      .status(200)
      .json({ message: "OTP sent to admin. Awaiting verification." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const verifyOtppasscode = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const unverifiedTeacher = await UnverifiedTeacher.findOne({ email });

    if (!unverifiedTeacher) {
      return res.status(404).json({ error: "Unverified user not found." });
    }

    if (
      unverifiedTeacher.otp !== otp ||
      unverifiedTeacher.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    const { name, mobileNumber, password } = unverifiedTeacher;
    const teacher = new Teacher({
      name,
      email,
      mobileNumber,
      password,
    });

    await teacher.save();
    await UnverifiedTeacher.deleteOne({ email });

    res
      .status(200)
      .json({
        success: true,
        message: "Verification successful. You can now log in.",
      });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, teacher.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Store the OTP and expiry in the database
    teacher.otp = otp;
    teacher.otpExpiry = otpExpiry;
    await teacher.save();

    await sendOtpToEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Check if OTP matches and is not expired
    if (teacher.otp !== otp || Date.now() > teacher.otpExpiry) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    

    // Clear OTP and OTP expiry after successful verification
    teacher.otp = null;
    teacher.otpExpiry = null;

    // Generate session ID and set expiry to 6 hours from now
    const sessionId = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours from now

    teacher.sessions.push({ sessionId, expiresAt });
    await teacher.save();

    res.status(200).json({
      message: "Login successful",
      sessionId,
      teacherId: teacher._id,
      name: teacher.name,
      email: teacher.email,
      mobileNumber: teacher.mobileNumber,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const verifySession = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const teacher = await Teacher.findOne({ "sessions.sessionId": sessionId });

    if (!teacher) {
      return res.status(401).json({ valid: false, error: "Session not found" });
    }

    const session = teacher.sessions.find((s) => s.sessionId === sessionId);

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      return res.status(401).json({ valid: false, error: "Session expired" });
    }

    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the reset token before saving to the database
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Set token expiry time (10 minutes from now)
    const tokenExpiry = Date.now() + 10 * 60 * 1000;

    // Save the hashed token and expiry in the database
    teacher.resetPasswordToken = hashedToken;
    teacher.resetPasswordExpiry = tokenExpiry;
    await teacher.save();

    // Construct the reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset_password?token=${resetToken}&email=${email}`;

    // Send the reset link to the teacher's email
    await sendResetLinkToEmail(email, resetLink);

    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    console.log(teacher)
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Verify the reset token
    const isTokenValid = await bcrypt.compare(
      token,
      teacher.resetPasswordToken
    );
    console.log("reset");

    if (!isTokenValid || Date.now() > teacher.resetPasswordExpiry) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    teacher.password = hashedPassword;

    // Clear the reset token and expiry
    teacher.resetPasswordToken = null;
    teacher.resetPasswordExpiry = null;

    await teacher.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  login,
  verifyOtp,
  verifySession,
  signUp,
  verifyOtppasscode,
  forgotPassword,
  resetPassword,
};
