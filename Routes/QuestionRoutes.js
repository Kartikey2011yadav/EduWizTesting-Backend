const express = require("express");
const {addQuestion,getQuestionDetailsByTeacherId, updateQuestionbyId, deleteQuestion} = require("../Controller/QuestionController");
const router = express.Router();

router.post("/addQuestion",addQuestion);
router.post("/getQuestionDetailsByTeacherId",getQuestionDetailsByTeacherId);
router.put('/updateQuestion/:questionId', updateQuestionbyId);
router.delete('/deleteQuestion/:questionId', deleteQuestion);

module.exports = router;