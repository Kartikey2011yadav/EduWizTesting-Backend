<<<<<<< HEAD
const { default: mongoose } = require('mongoose');
const SchedulePaper = require('../Models/ScheduledPaper');
const Teacher = require('../Models/Teacher');
=======
const Omr = require("../Models/Omr.model");
const SchedulePaper = require("../Models/ScheduledPaper");
>>>>>>> a96caf128ab88814e3acf0854e580c8aaae69f88

// Schedule a paper
const schedulePaper = async (req, res) => {
  try {
    const { paperName, className, subject, marks, duration, date, time } =
      req.body;

    const newPaper = new SchedulePaper({
      paperName,
      className,
      subject,
      marks,
      duration,
      date,
      time,
    });

    const savedPaper = await newPaper.save();
    res.status(201).json(savedPaper);
  } catch (err) {
    res.status(500).json({ error: "Failed to schedule paper", details: err });
  }
};

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

const getAllScheduledPapers= async (req, res) => {
  
  const { teacherID } = req.body;

  //Check teacher ID is valid or not??
  const isValid = mongoose.Types.ObjectId.isValid(teacherID);
  if (!isValid) {
      console.error('Invalid TeacherID');
      return res.status(400).json({
        success: false,
        message : 'Invalid TeacherID'
      });
  }

  // Present date
  const presentDate = new Date(); 
  
  try{
      
      

      //finding all tests with a particular teacherID which are yet to take place
      const allPapers = await SchedulePaper.find({teacher: teacherID, date: {$gte: presentDate}})// will get only those papers which are  yet to happen
      .sort({date: 1})//sort papers from lowest date to highest to view upcoming tests
      .exec();

      console.log('All Papers:', allPapers);

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
<<<<<<< HEAD
    schedulePaper,
    getAllScheduledPapers
  };
=======
  schedulePaper,
  submitOmr,
  getOmrSheets,
};
>>>>>>> a96caf128ab88814e3acf0854e580c8aaae69f88
