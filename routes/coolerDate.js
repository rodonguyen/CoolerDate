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

router.post('/find', getEntry, (req, res) => {
  if (res.found)  res.status(201).json({message: "Entry exists", found: true, entry: res.entry})
  else  res.status(201).json({message: "Entry does not exist", found: false, request: req.body})
})


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
router.post("/updateFirstAccessTime", async (req, res) => {
  try {
    const addedTimeEntry = await CoolerDate.findOneAndUpdate(
      {
        username: req.body.username,
        code: req.body.code,
      },
      { firstAccessTime: new Date()}
    );
    res.status(201).json(addedTimeEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Deleting one
router.delete('/deleteOne', getEntry, async (req, res) => {
  if (!res.found) {
    res.status(201).json({message: "Entry does not exist, do nothing"})
    return
  }
  try {
    await res.entry.remove()
    res.json({ message: 'Deleted Entry', entry: res.entry })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




async function getEntry(req, res, next) {
  let entry

  try {
    entry = await CoolerDate.findOne({
      username: req.body.username,
      code: req.body.code
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  // console.log(entry)
  if (!entry) {
    res.found = false
  }
  else {
    res.found = true
    res.entry = entry
  }
  next()
}



module.exports = router;
