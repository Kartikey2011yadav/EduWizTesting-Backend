const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  heading: { type: String, required: true },
  description: { type: String, required: true },
  difficultyLevel: { type: String, required: true },
  marks: { type: Number, required: true },
  option: { type: String, required: true },
  mcqOptions: [{ type: String }],
  expectedTime: {
    hours: { type: String, required: true },
    minutes: { type: String, required: true },
  },
  tags: [{ type: String }],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
