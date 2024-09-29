const SchedulePaper = require('../Models/ScheduledPaper');

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
    res.status(500).json({ error: 'Failed to schedule paper', details: err });
  }
};

module.exports = {
    schedulePaper
  };