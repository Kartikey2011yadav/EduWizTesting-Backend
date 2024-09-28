const express = require("express");
const { Upload, removeFile } = require("../Controller/CloudinaryController");
const {
  schedulePaper,
  submitOmr,
  getOmrSheets,
} = require("../Controller/PaperController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/schedule", schedulePaper);
router.post("/upload", upload.single("file"), Upload);
router.post("/remove-file", removeFile);
router.post("/submit", submitOmr);
router.get("/omr-sheets", getOmrSheets);

module.exports = router;
