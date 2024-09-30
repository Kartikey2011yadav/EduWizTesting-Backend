const express = require("express");
const {addQuestion,getQuestionDetailsByTeacherId} = require("../Controller/QuestionController");
const router = express.Router();

router.post("/addQuestion",addQuestion);
router.post("/getQuestionDetailsByTeacherId",getQuestionDetailsByTeacherId);

module.exports = router;