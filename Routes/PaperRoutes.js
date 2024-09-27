const express = require("express");
const { schedulePaper, getAllScheduledPapers } = require("../Controller/PaperController");

const router = express.Router();

router.post("/schedule", schedulePaper);
router.get("/getScheduledPapers", getAllScheduledPapers);

module.exports = router;
