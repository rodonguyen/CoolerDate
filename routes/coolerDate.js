const express = require("express");
const router = express.Router();
const CoolerDate = require("../models/coolerDate");

// Getting all coolerDate codes
router.get("/", async (req, res) => {
  try {
    const codes = await CoolerDate.find();
    res.json(codes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating new coolerDate code
router.post("/add", getEntry, async (req, res) => {
  if (res.found) {
    res.status(201).json({message: "Entry exists, do nothing"})
    return
  }
  try {
    const newCode = await CoolerDate.create({
      username: req.body.username,
      code: req.body.code,
    });
    res.status(201).json(newCode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.post("/updateFirstAccessTime", async function(req, res) {
  console.log(new Date())

  let entry = await CoolerDate.findOne(
    {
      username: req.body.username,
      code: req.body.code,
    }
  );
  console.log(entry)
});

async function getEntry(req, res, next) {
  let entry

  try {
    entry = await CoolerDate.find({
      username: req.body.username,
      code: req.body.code
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  if (entry.length == 0) {
    res.found = false
  }
  else {
    res.found = true
  }
  next()
}

module.exports = router;
