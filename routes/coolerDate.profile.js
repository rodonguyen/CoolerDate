const express = require("express");
const router = express.Router();
const Profile = require("../models/coolerDate.profile");

// Getting content of an entry
router.post('/find', getEntry, (req, res) => {
  console.log('/find ===>', req.body);

  if (res.found)  res.status(201).json({message: 'Entry exists.', found: true, entry: res.entry})
  else            res.status(201).json({message: 'Entry does not exist.', found: false, request: req.body})
})


// Creating new coolerDate code
router.post("/add", getEntry, async (req, res) => {
  console.log('/profile/add ===>', req.body);
    
  if (res.found) {
    // console.log('found', res.entry.content, '\nreq', req.body.content)

    // If content are identical, do nothing
    if (res.entry.content.toString() === req.body.content.toString()) {
      res.status(201).json({message: 'Entry already exists, do nothing.'});
      return
    }
    // Else, update the content of this (username, profile)
    console.log('Update the content.')
    const updated = updateContent(req.body.username, req.body.profile, req.body.content)
    res.status(201).json({...updated, message: 'Updated the content.'})
    return
  }

  // if entry does not exist, add it
  try {
    const newProfile = await Profile.create({
      username: req.body.username,
      profile: req.body.profile,
      content: req.body.content
    });
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Updating One
router.post("/updateContent", async (req, res) => {
  console.log('/updateContent ===>', req.body);

  try {
    const addedTimeEntry = await Profile.findOneAndUpdate(
      {
        username: req.body.username,
        profile: req.body.profile        
      },
      { content: req.body.content }
    );
    res.status(201).json(addedTimeEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Deleting one
router.delete('/deleteOne', getEntry, async (req, res) => {
  console.log('/deleteOne ===>', req.body);

  if (!res.found) {
    res.status(201).json({message: "Entry does not exist, do nothing."})
    return
  }
  try {
    await res.entry.remove();
    res.json({ message: 'Deleted Entry.', entry: res.entry })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// ***********************************************************
// **               AUXILIARY FUNCTIONS                     **
// ***********************************************************

async function updateContent(username, profile, content) {
  const response = await Profile.findOneAndUpdate(
    {
      username: username,
      profile: profile        
    },
    { content: content })
  return response;
}


// ***********************************************************
// **               MIDDLEMAN FUNCTIONS                     **
// ***********************************************************

/** Return the entry's data if it exists in the database already */
async function getEntry(req, res, next) {
  let entry

  try {
    entry = await Profile.findOne({
      username: req.body.username,
      profile: req.body.profile
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
