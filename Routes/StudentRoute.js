const express = require("express");
const { login } = require("../Controller/TeacherController");

const router = express.Router();

router.post("/login", login);
router.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = router;
