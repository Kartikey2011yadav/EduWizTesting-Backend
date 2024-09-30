const Question = require("../Models/Question");

const addQuestion = async (req, res) => {
  const {
    teacherId,
    heading,
    description,
    difficultyLevel,
    marks,
    option,
    mcqOptions,
    expectedTime,
    divTag,
  } = req.body;
  const newQuestion = new Question({
    teacherId,
    heading,
    description,
    difficultyLevel,
    marks,
    option,
    mcqOptions,
    expectedTime,
    tags: divTag,
  });
  if (!newQuestion) return res.status(400).json({ error: "Server Error!!!" });
  const savedQuestion = await newQuestion.save();
  if (!savedQuestion)
    return res.status(500).json({ error: "Failed to Add Question!!!" });
  res.status(200).json({ message: "Question Added Successfully!!!" });
};

const getQuestionDetailsByTeacherId = async(req,res)=>
{
    const {teacherId} = req.body;
    const questions = await Question.find({teacherId});
    if(questions.length <= 0) return res.status(404).json({error: "Questions Not found for this teacher!!!"});
    res.status(200).json({questions});
}

module.exports = {
  addQuestion,
  getQuestionDetailsByTeacherId,
};
