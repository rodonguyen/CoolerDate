const express = require("express");
const router = express.Router();
const Code = require("../models/coolerDate.code");

// Finding an entry
router.post("/find", getEntry, (req, res) => {
  if (res.found)
    res
      .status(201)
      .json({ message: "/coolerDate/code/find --> Entry exists", found: true, entry: res.entry });
  else
    res
      .status(201)
      .json({
        message: "Entry does not exist",
        found: false,
        request: req.body,
      });
});

// Creating new coolerDate code
router.post("/add", getEntry, async (req, res) => {
  if (res.found) {
    res.status(201).json({ message: "/coolerDate/code/add --> Entry exists, do nothing" });
    return;
  }
  try {
    // if (req.body.username && req.body.code && req.body.username) 
    //   throw "Missing required property 'username'."
    const newCode = await Code.create({
      username: req.body.username,
      code: req.body.code,
      profileCode: req.body.profileCode
    });
    res.status(201).json(newCode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Updating One
router.patch("/patchFirstAccessTime", async (req, res) => {
  try {
    const addedTimeEntry = await Code.findOneAndUpdate(
      {
        username: req.body.username,
        code: req.body.code,
      },
      { firstAccessTime: new Date() }
    ).then((res) => {
      console.log(res)
      if (res === null) return { message: "/coolerDate/code/patchFirstAccessTime --> Entry does not exist, do nothing" };
      return res
    });
    res.status(201).json(addedTimeEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deleting one
router.delete("/deleteOne", getEntry, async (req, res) => {
  if (!res.found) {
    res.status(201).json({ message: "/coolerDate/code/deleteOne --> Entry does not exist, do nothing" });
    return;
  }
  try {
    await res.entry.remove();
    res.json({ message: "Deleted Entry", entry: res.entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function getEntry(req, res, next) {
  let entry;

  try {
    entry = await Code.findOne({
      username: req.body.username,
      code: req.body.code,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // console.log(entry)
  if (!entry) {
    res.found = false;
  } else {
    res.found = true;
    res.entry = entry;
  }
  next();
}

module.exports = router;
