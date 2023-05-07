const express = require("express");
const router = express.Router();
const Code = require("../models/coolerDate.code");
require("dotenv").config();


// Creating new coolerDate code
router.post("/add", getEntry, async (req, res) => {
  console.log('/code/add ===>', req.body);
  
  if (res.found) {
    res.status(200).json({ message: "Entry exists, do nothing." });
    return;
  }
  try {
    const newCode = await Code.create({
      username: req.body.username,
      code: req.body.code,
      profile: req.body.profile
    });
    res.status(201).json(newCode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/**
 * Check an entry 
 * It must satisfy 2 things:
 *    - It exist
 *    - Its firstAccessTime is less than 3 days old
 *    - hoursTookToSubmit === -1
 * If it does, addFirstAccessTime and return true
 * */ 
router.post("/check", getEntry, async (req, res) => {
  console.log('/check ===>', req.body);

  // Entry does not exist
  if (!res.found) {
    return res.status(200).json({ isValid: false })
  }

  // Check expiration status if the code has been accessed. 
  // Return false if daysSinceFirstAccess is older than [a number] days. 
  // Note that [a number] can change. 
  if (res.entry.firstAccessTime) {
    const startTime = new Date(res.entry.firstAccessTime)
    const now = Date.now()
    const daysSinceFirstAccess = Math.abs((now - startTime.getTime())) / 3600 / 24 / 1000;
    if (daysSinceFirstAccess > 3) return res.status(200).json({ isValid: false });
  }

  // Check if the code is used. Return false if hoursTookToSubmit is >= 0. 
  // FYI, default value is -1, which means unused.
  if (res.entry.hoursTookToSubmit !== -1) {
    return res.status(200).json({ isValid: false });
  }

  // Else, the code is valid
  const finalResponse = { isValid: true, entry: res.entry }

  // Add firstAccessTime if the code is opened for the first time
  if (!res.entry.firstAccessTime) {
    const response = await addFirstAccessTime(req.body.username, req.body.code)
    finalResponse.message = response.message
  }

  res.status(201).json(finalResponse);
});


//** Finding an entry */ 
router.post("/queryOne", getEntry, (req, res) => {
  console.log('/queryOne ===>', req.body);

  if (res.found)
    res
      .status(200)
      .json({ found: true, 
              entry: res.entry });
  else            
    res
      .status(200)
      .json({
        found: false,
        request: req.body,
      });  
});      


router.patch("/addFirstAccessTime", async (req, res) => {
  console.log('/addFirstAccessTime ===>', req.body);

  try {
    const added = await addFirstAccessTime(req.body.username, req.body.code)
    res.status(201).json(added);
  } catch (err) {
    res.status(400).json({ error: err.message }); 
  }
});


router.patch("/nullifyFirstAccessTime", getEntry, async (req, res) => {
  console.log('/nullifyFirstAccessTime ===>', req.body);

  try {
    const nullified = await nullifyFirstAccessTime(req.body.username, req.body.code)
    res.status(201).json(nullified);
  } catch (err) {
    res.status(400).json({ error: err.message }); 
  }
});

router.patch("/patchProfile",  async (req, res) => {
  console.log('/patchProfile ===>', req.body);

  try {
    const patchProfile = await Code.findOneAndUpdate(
      {
        username: req.body.username,
        code: req.body.code,
      },
      { profile: req.body.profile }
    ).then((res) => {
      if (res === null) return { message: "Entry does not exist, do nothing." };
      return { message: "Patch `profile` successfully." };
    });

    res.status(201).json(patchProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deleting one
router.delete("/deleteOne", getEntry, async (req, res) => {
  console.log('/deleteOne ===>', req.body);

  if (!res.found) {
    res.status(201).json({ message: "Entry does not exist, do nothing." });
    return;
  } 
  
  try {
    await res.entry.remove();
    res.json({ message: "Deleted Entry."});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ***********************************************************
// **               MIDDLEMAN FUNCTIONS                     **
// ***********************************************************

/** Return the entry's data if it exists in the database already */
async function getEntry(req, res, next) {
  if (!req.body.username || !req.body.code) {
    return res.status(400).json({ message: "Missing property (`username` or `code`)." });
  }

  let entry;

  try {
    entry = await Code.findOne({
      username: req.body.username,
      code: req.body.code,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
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

// ***********************************************************
// **               AUXILIARY FUNCTIONS                     **
// ***********************************************************

const addFirstAccessTime = async (username, code) => {
  const response = await Code.findOneAndUpdate(
    {
      username: username,
      code: code,
    },
    { firstAccessTime: new Date() }
  ).then((res) => {
    if (res === null)
      return {
        message: "Entry does not exist, do nothing.",
      };
    return { message: "Add firstAccessTime successfully." };
  });

  return response;
};

const nullifyFirstAccessTime = async (username, code) => {

  const response = await Code.findOneAndUpdate({
      username: username,
      code: code,
    },
    { firstAccessTime: null })
    .then((res) => {
      if (res === null) return { message: "Entry does not exist, do nothing."};
      return {message: 'Nullify firstAccessTime successfully.'}
    })
  return response
};

module.exports = router;
