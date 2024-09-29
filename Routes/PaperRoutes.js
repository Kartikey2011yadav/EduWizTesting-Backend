const express = require("express");
const { Upload, removeFile } = require("../Controller/CloudinaryController");
const {
  schedulePaper,
  submitOmr,
  getOmrSheets,
  getSchedulePaper
} = require("../Controller/PaperController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/schedule", schedulePaper);
router.post("/upload", upload.single("file"), Upload);
router.post("/remove-file", removeFile);
router.post("/submit", submitOmr);

router.get("/omr-sheets", getOmrSheets);
router.get("/schedule", getSchedulePaper);

module.exports = router;
