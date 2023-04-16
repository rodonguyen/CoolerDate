const express = require("express");
const router = express.Router();
const Respondent = require("../models/coolerDate.respondent");
const Code = require("../models/coolerDate.code");

// Adding new respondent information
router.post("/add", async (req, res) => {
  console.log("/respondent/add ===>", req.body);

  // Add an entry
  try {
    const newRespondent = await Respondent.create({
      username: req.body.username,
      code: req.body.code,
      name: req.body.name,
      contact: req.body.contact,
      bio: req.body.bio,
      ifact: req.body.ifact,
      place: req.body.place,
      dressing: req.body.dressing,
      boyfriend: req.body.boyfriend,
    });

    // Add hoursTookToSubmit
    const responseMessage = await addHoursTookToSubmit(
      req.body.username,
      req.body.code
    )

    newRespondent.addHoursTookToSubmitMessage = responseMessage.message; // Not added, need fixing
    res.status(201).json({
      newRespondent, 
      addHoursTookToSubmitMessage: responseMessage.message
    });
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Deleting one
router.delete("/deleteOne", getEntry, async (req, res) => {
  console.log("/deleteOne ===>", req.body);

  if (!res.found) {
    res.status(201).json({ message: "Entry does not exist, do nothing" });
    return;
  }
  try {
    await res.entry.remove();
    res.json({ message: "Deleted Entry", entry: res.entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ***********************************************************
// **               AUXILIARY FUNCTIONS                     **
// ***********************************************************

async function addHoursTookToSubmit(username, code) {
  // Find the entry to get firstAccessTime
  const entry = await Code.findOne({
    username: username,
    code: code,
  });

  if (!entry) {
    return { message: "Entry does not exist, do nothing" };
  }

  const hourDifference = (new Date() - Date.parse(entry.firstAccessTime)) / 1000 / 3600;
  // console.log("hourDifference", hourDifference)

  // Update hoursTookToSubmit to the entry with calculated hourDifference
  await Code.updateOne(
    {
      username: username,
      code: code,
    },
    {
      hoursTookToSubmit: hourDifference,
    }
  );

  return { message: "Add hoursTookToSubmit successfully." };
};

// ***********************************************************
// **               MIDDLEMAN FUNCTIONS                     **
// ***********************************************************

/** Return the entry's data if it exists in the database already */
async function getEntry(req, res, next) {
  let entry;

  try {
    entry = await Respondent.findOne({
      username: req.body.username,
      code: req.body.code,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  if (!entry) {
    res.found = false;
  } else {
    res.found = true;
    res.entry = entry;
  }
  next();
}

module.exports = router;
