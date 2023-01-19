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
 *         - profileCode
 *       properties:
 *         username:
 *           type: string
 *           description: username
 *         code:
 *           type: string
 *           description: code
 *         profileCode:
 *           type: string
 *           description: profileCode is used to link to profile schema
 *         firstAccessTime:
 *           type: string
 *           description: time of the moment user first entering the code on app
 *       example:
 *         username: rodonguyen
 *         code: youaregorgous
 *         profileCode: goodboy
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
 *                 profileCode:
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
 *                 profileCode:
 *                   type: string
 *                   example: neutral
 *
 */


function send(){
  const fullUrl = "http://localhost:3001/coolerDate/code/addFirstAccessTime"
  const entry = {
    username: 'rodonguyen', 
    code: 'newcode123'
  }

  axios.post(fullUrl, JSON.stringify(entry))
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.log(err));
}


// Finding an entry
router.post("/queryOne", getEntry, (req, res) => {
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
 *    - Its firstAccessTime is less than 24*7 hours old
 * Finally pathFirstAccessTime and return true
 * */ 
router.post("/check", getEntry, async (req, res) => {
  // Entry does not exist
  if (!res.found) {
    return res.status(201).json({ isValid: false })
  }
  // If the code has been opened
  if (res.entry.firstAccessTime) {
    const startTime = new Date(res.entry.firstAccessTime)
    const now = Date.now()
    const daysOfAge = Math.abs((now - startTime.getTime())) / 3600 / 1000 / 24 / 7;
    // console.log('now', now, 'startTime', startTime)
    // console.log(daysOfAge)
    if (daysOfAge > 7) return res.status(201).json({ isValid: false });
  }

  const finalResponse = { isValid: true }

  // If the code exists but has not been used
  if (!res.entry.firstAccessTime) {
    console.log('Adding time...')
    const addedTime = await addFirstAccessTime(req.body.username, req.body.code)
    finalResponse.message = addedTime.message
  }

  res.status(201).json(finalResponse);
});


// Creating new coolerDate code
router.post("/add", getEntry, async (req, res) => {
  if (res.found) {
    res.status(201).json({ message: "Entry exists, do nothing" });
    return;
  }
  try {
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

router.patch("/addFirstAccessTime", async (req, res) => {
  try {
    const added = await addFirstAccessTime(req.body.username, req.body.code)
    res.status(201).json(added);
  } catch (err) {
    res.status(400).json({ error: err.message }); 
  }
});

router.patch("/nullifyFirstAccessTime", async (req, res) => {
  try {
    const nullified = await nullifyFirstAccessTime(req.body.username, req.body.code)
    console.log(nullified)
    res.status(201).json(nullified);
  } catch (err) {
    res.status(400).json({ error: err.message }); 
  }
});

router.patch("/patchProfileCode", async (req, res) => {
  try {
    const patchProfileCode = await Code.findOneAndUpdate(
      {
        username: req.body.username,
        code: req.body.code,
      },
      { profileCode: req.body.profileCode }
    ).then((res) => {
      console.log(res)
      if (res === null) return { message: "Entry does not exist, do nothing" };
      return { message: "Patch new ProfileCode successfully" };
    });
    res.status(201).json(patchProfileCode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deleting one
router.delete("/deleteOne", getEntry, async (req, res) => {
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


const addFirstAccessTime = async (username, code) => {
  const response = await Code.findOneAndUpdate({
      username: username,
      code: code,
    },
    { firstAccessTime: new Date() })
    .then((res) => {
      if (res === null) return { message: "addFirstAccessTime --> Entry does not exist, do nothing"};
      return {message: 'Add firstAccessTime successfully'}

    })
  return response
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
