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
    mcqAnswer,
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
    mcqAnswer,
    expectedTime,
    tags: divTag,
  });
  if (!newQuestion) return res.status(400).json({ error: "Server Error!!!" });
  const savedQuestion = await newQuestion.save();
  if (!savedQuestion)
    return res.status(500).json({ error: "Failed to Add Question!!!" });
  res.status(200).json({ message: "Question Added Successfully!!!" });
};

const getQuestionDetailsByTeacherId = async (req, res) => {
  const { teacherId } = req.body;
  const questions = await Question.find({ teacherId });
  if (questions.length <= 0) return res.status(404).json({ error: "Questions Not found for this teacher!!!" });
  res.status(200).json({ questions });
}

const updateQuestionbyId = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const {
      teacherId,
      heading,
      description,
      difficultyLevel,
      marks,
      option,
      mcqOptions,
      mcqAnswer,
      expectedTime,
      divTag,
    } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      {
        teacherId,
        heading,
        description,
        difficultyLevel,
        marks,
        option,
        mcqOptions,
        mcqAnswer: await bcrypt.hash(mcqAnswer, 10),
        expectedTime,
        tags: divTag
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error) {
    res.status(500).json({ error: 'Error updating question' });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { teacherId } = req.body;

    // Find the question and ensure it belongs to the teacher
    const question = await Question.findOne({
      _id: questionId,
      teacherId: teacherId
    });

    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'Question not found or you do not have permission to delete it' 
      });
    }

    // Delete the question
    await Question.findByIdAndDelete(questionId);

    res.status(200).json({ 
      success: true, 
      message: 'Question deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while deleting the question' 
    });
  }
};

module.exports = {
  addQuestion,
  getQuestionDetailsByTeacherId,
  updateQuestionbyId,
  deleteQuestion,
};
