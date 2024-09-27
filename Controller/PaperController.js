const SchedulePaper = require('../Models/ScheduledPaper');
const Teacher = require('../Models/Teacher');

// Schedule a paper
const schedulePaper = async (req, res) => {
  try {
    const { paperName, className, subject, marks, duration, date, time } = req.body;
    
    const newPaper = new SchedulePaper({
      paperName,
      className,
      subject,
      marks,
      duration,
      date,
      time
    });

    const savedPaper = await newPaper.save();
    res.status(201).json(savedPaper);
  } catch (err) {
    res.status(500).json({ error: 'Failed to schedule paper', details: err });
  }
};

const getAllScheduledPapers= async (req, res) => {
  const { sessionId } = req.body;
  const presentDate = new Date(); // current date
  try{
      //get teacher ID
      const teacher = await Teacher.findOne({ "sessions.sessionId": sessionId });
      
      //finding all tests with a particular teacherID which are yet to take place
      const allPapers = await SchedulePaper.find({teacher: teacher, date: {$gte: presentDate}})// will get only those papers which are  yet to happen
          .sort({date: 1})//sort papers from lowest date to highest to view upcoming tests
          .exec();

      // return response
      return res.status(200).json({
          success: true,
          message: 'Data of all Tests fetched Succesfully',
          data: allPapers
      })
      
  }catch(err){
      console.log(err);
      return res.status(500).json({
          success: false,
          message: 'Cannot fetch Tests Data',
          error: err.message,
      })
  }
};

module.exports = {
    schedulePaper,
    getAllScheduledPapers
  };