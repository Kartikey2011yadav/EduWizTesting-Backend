const mongoose = require('mongoose');

const schedulepaperSchema = new mongoose.Schema({
  paperName: { type: String, required: true },
  className: { type: String, required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }
});

const SchedulePapers = mongoose.model('SchedulePapers', schedulepaperSchema);

module.exports = SchedulePapers;
