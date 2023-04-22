const express = require("express");
const router = express.Router();
const Code = require("../models/coolerDate.code");
require("dotenv").config();
const rootUrl = process.env.SERVER_URL
const axios = require('axios');



/**
 * @swagger
 * components:
 *   schemas:
 *     coolerDate.code:
 *       type: object
 *       required:
 *         - username
 *         - code
 *         - profile
 *       properties:
 *         username:
 *           type: string
 *           description: Each `username` is the unique identity of each user in the app
 *         code:
 *           type: string
 *           description: The `code` receiver uses to access a person's coolerdate page. Unique to each `username`.
 *         profile:
 *           type: string
 *           default: default
 *           description: Each `profile` ID is linked to a profile content that user want to display for the associated `code`
 *         firstAccessTime:
 *           type: string
 *           description: The time of the moment user first entering the code on app
 *         hoursTookToSubmit:
 *           type: number
 *           description: The number of hours the receiver took to submit since they first opened the code
 *       example:
 *         username: rodonguyen
 *         code: youaregorgeous
 *         profile: default
 *         firstAccessTime: 2020-03-10T04:05:06.157Z
 *         hoursTookToSubmit: 0.12
 *  
 * 
 * tags:
 *   name: coolerDate.code
 *   description: "Managing (`username`, `code`) information"
 * /coolerDate/code/add:
 *   post:
 *     summary: Create a new `code` for a `user`
 *     tags: [coolerDate.code]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *                 example: rodonguyen
 *               code:
 *                 type: string
 *                 example: youaregorgeous
 *               profile:
 *                 type: string
 *                 example: default
 *     responses:
 *       200:
 *         description: The `code` exists for a `user`, do nothing 
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Entry exists, do nothing.
 *       201:
 *         description: Successfully add a new `code` for a `user`
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 username:
 *                   type: string
 *                   example: rodonguyen
 *                 code:
 *                   type: string
 *                   example: youaregorgeous
 *                 profile:
 *                   type: string
 *                   example: default
 *                 firstAccessTime: 
 *                   type: string
 *                   example: 
 *                 hoursTookToSubmit: 
 *                   type: number
 *                   example: -1
 *       400:
 *         description: Invalid input, missing required propertie(s) which is `code` in this case
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "coolerdate_code validation failed: code: Path `code` is required."
 * 
 * 
 * /coolerDate/code/check:
 *   post:
 *     summary: Check the validity of a `code` of a `user`
 *     description: Check if a code is exist, unexpired, and unused. If the code is valid and does not have `firstAccessTime`, the server will assign `firstAccessTime` as the current time.
 *     tags: [coolerDate.code]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *                 example: elonmusk
 *               code: 
 *                 type: string
 *                 example: youaregorgeous
 *     responses:
 *       200:
 *         description: Successfully check a `code` for a `user`. Code is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                   example: false  
 *       201:
 *         description: Successfully check a `code` for a `user`. Code is valid.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                   example: true
 *                 entry:
 *                   properties: 
 *                       username: 
 *                         type: string
 *                         example: rodonguyen
 *                       code: 
 *                         type: string
 *                         example: youaregorgeous
 *                       profile: 
 *                         type: string
 *                         example: default
 *                       firstAccessTime: 
 *                         type: string
 *                         example: 2020-03-10T04:05:06.157Z
 *                       hoursTookToSubmit: 
 *                         type: number
 *                         example: -1
 *       400:
 *         description: Invalid input, missing required propertie(s) which is `code` in this case
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                   example: false
 * 
 * 
 * 
 */



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


// Finding an entry
router.post("/queryOne", getEntry, (req, res) => {
  console.log('/queryOne ===>', req.body);

  if (res.found)
    res
      .status(201)
      .json({ message: "Entry exists, do nothing.", 
              found: true, 
              entry: res.entry });
  else            
    res
      .status(201)
      .json({
        message: "Entry does not exist",
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


router.patch("/nullifyFirstAccessTime", async (req, res) => {
  console.log('/nullifyFirstAccessTime ===>', req.body);

  try {
    const nullified = await nullifyFirstAccessTime(req.body.username, req.body.code)
    console.log('Nullified entry:', nullified)
    res.status(201).json(nullified);
  } catch (err) {
    res.status(400).json({ error: err.message }); 
  }
});

router.patch("/patchProfile", async (req, res) => {
  console.log('/patchProfile ===>', req.body);

  try {
    const patchProfile = await Code.findOneAndUpdate(
      {
        username: req.body.username,
        code: req.body.code,
      },
      { profile: req.body.profile }
    ).then((res) => {
      console.log('Patched entry:', res)
      if (res === null) return { message: "Entry does not exist, do nothing." };
      return { message: "Patch new Profile successfully" };
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
    res.json({ message: "Deleted Entry.", entry: res.entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ***********************************************************
// **               MIDDLEMAN FUNCTIONS                     **
// ***********************************************************

/** Return the entry's data if it exists in the database already */
async function getEntry(req, res, next) {
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
        message: "addFirstAccessTime --> Entry does not exist, do nothing",
      };
    return { message: "Add firstAccessTime successfully" };
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
      if (res === null) return { message: "nullifyFirstAccessTime --> Entry does not exist, do nothing"};
      return {message: 'Nullify firstAccessTime successfully'}
    })
  return response
};

module.exports = router;
