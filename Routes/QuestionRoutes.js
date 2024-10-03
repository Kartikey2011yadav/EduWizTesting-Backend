const express = require("express");
const {addQuestion,getQuestionDetailsByTeacherId, updateQuestionbyId} = require("../Controller/QuestionController");
const router = express.Router();

router.post("/addQuestion",addQuestion);
router.post("/getQuestionDetailsByTeacherId",getQuestionDetailsByTeacherId);
router.put('/updateQuestion/:questionId', updateQuestionbyId);
module.exports = router;