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
 *           description: username
 *         code:
 *           type: string
 *           description: code
 *         profile:
 *           type: string
 *           description: profile is used to link to profile schema
 *         firstAccessTime:
 *           type: string
 *           description: time of the moment user first entering the code on app
 *       example:
 *         username: rodonguyen
 *         code: youaregorgous
 *         profile: goodboy
 *         firstAccessTime: 2020-03-10T04:05:06.157Z
 *  
 * tags:
 *   name: coolerDate.code
 *   description: The books managing API
 * /coolerDate/code/add:
 *   post:
 *     summary: Create a new code
 *     tags: [coolerDate.code]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/coolerDate.code'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 username:
 *                   type: string
 *                   example: rodonguyen
 *                 code:
 *                   type: string
 *                   example: youaregorgous
 *                 profile:
 *                   type: string
 *                   example: neutral
 *       400:
 *         description: Invalid input, missing required propertie(s)
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 username:
 *                   type: string
 *                   example: rodonguyen
 *                 profile:
 *                   type: string
 *                   example: neutral
 *
 */



// Finding an entry
router.post("/queryOne", getEntry, (req, res) => {
  console.log('/queryOne ===>', req.body);

  if (res.found)
    res
      .status(201)
      .json({ message: "Entry exists, do nothing", 
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
    return res.status(201).json({ isValid: false })
  }

  // Check expiration status if the code has been accessed. 
  // Return false if daysSinceFirstAccess > 7 days.
  if (res.entry.firstAccessTime) {
    const startTime = new Date(res.entry.firstAccessTime)
    const now = Date.now()
    const daysSinceFirstAccess = Math.abs((now - startTime.getTime())) / 3600 / 24 / 1000;
    if (daysSinceFirstAccess > 3) return res.status(201).json({ isValid: false });
  }

  // Check if the code is used. Return false if hoursTookToSubmit is >= 0. 
  // FYI, default value is -1, which means unused.
  if (res.entry.hoursTookToSubmit !== -1) {
    return res.status(201).json({ isValid: false });
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


// Creating new coolerDate code
router.post("/add", getEntry, async (req, res) => {
  console.log('/code/add ===>', req.body);
  
  // TODO: add middleman function/code to 
  // add the entry ONLY IF the profile exist


  if (res.found) {
    res.status(201).json({ message: "Entry exists, do nothing" });
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
      if (res === null) return { message: "Entry does not exist, do nothing" };
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
    res.status(201).json({ message: "Entry does not exist, do nothing" });
    return;
  }
  try {
    await res.entry.remove();
    res.json({ message: "Deleted Entry", entry: res.entry });
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
