const express = require("express");
const { schedulePaper } = require("../Controller/PaperController");

const router = express.Router();

router.post("/schedule", schedulePaper);

module.exports = router;
