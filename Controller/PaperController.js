const Omr = require("../Models/Omr.model");
const SchedulePaper = require("../Models/ScheduledPaper");

// Schedule a paper
const schedulePaper = async (req, res) => {
  try {
    const { paperName, className, subject, marks, duration, date, time, teacherId } = req.body;
    
    const newPaper = new SchedulePaper({
      paperName,
      className,
      subject,
      marks,
      duration,
      date,
      time,
      teacherId
    });

    const savedPaper = await newPaper.save();
    res.status(201).json(savedPaper);
  } catch (err) {
    res.status(500).json({ error: "Failed to schedule paper", details: err });
  }
};

const getSchedulePaper = async (req, res) => {
  try {
    const teacherId = req.headers['teacher-id'];
    
    if (!teacherId) {
      return res.status(400).json({ error: 'Teacher ID is required' });
    }
    
    const scheduledPapers = await SchedulePaper.find({ teacherId }).sort({ date: 1 });
    res.status(200).json(scheduledPapers);
  } catch (err) {
    res.status(500).json({ error: "Failed to get schedule papers", details: err });
  }
}

const submitOmr = async (req, res) => {
  try {
    const { paperId, studentRollNo, fileLink, studentName } = req.body;

    const newOmr = new Omr({
      studentRollNo,
      fileLink,
      studentName,
    });

    const savedOmr = await newOmr.save();
    res.status(201).json(savedOmr);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit OMR", details: err });
  }
};

const getOmrSheets = async (req, res) => {
  try {
    const omrSheets = await Omr.find({});
    res.status(200).json(omrSheets);
  } catch (err) {
    res.status(500).json({ error: "Failed to get OMR sheets", details: err });
  }
};

module.exports = {
  schedulePaper,
  submitOmr,
  getOmrSheets,
  getSchedulePaper,
};
