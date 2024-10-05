const Student = require("../Models/Student");
const {
  sendOtpToEmail,
  sendResetLinkToEmail,
} = require("../Config/nodemailer");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const isPasswordMatch = password === student.password;

    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Store the OTP and expiry in the database
    student.otp = otp;
    student.otpExpiry = otpExpiry;
    await student.save();

    await sendOtpToEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if OTP matches and is not expired
    if (student.otp !== otp || Date.now() > student.otpExpiry) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Clear OTP and OTP expiry after successful verification
    student.otp = null;
    student.otpExpiry = null;

    // Generate session ID and set expiry to 6 hours from now
    const sessionId = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours from now

    student.sessions.push({ sessionId, expiresAt });
    await student.save();

    res.status(200).json({
      message: "Login successful",
      sessionId,
      teacherId: student._id,
      name: student.name,
      email: student.email,
      mobileNumber: student.mobileNumber,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
