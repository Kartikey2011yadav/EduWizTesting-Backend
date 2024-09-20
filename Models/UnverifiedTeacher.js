const mongoose = require("mongoose");

const unverifiedTeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UnverifiedTeacher", unverifiedTeacherSchema);
