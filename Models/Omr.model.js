const mongoose = require("mongoose");
const { schedulePaper } = require("../Controller/PaperController");

const omrSchema = new mongoose.Schema({
  studentRollNo: { type: String, required: true },
  fileLink: { type: String, required: true },
  studentName: { type: String, required: true },
});

const Omr = mongoose.model("Omr", omrSchema);

module.exports = Omr;
