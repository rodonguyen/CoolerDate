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


/**
 * Check an entry 
 * It must satisfy 2 things:
 *    - It exist
 *    - Its firstAccessTime is less than 24*7 hours old
 * Finally pathFirstAccessTime and return true
 * */ 
router.post("/check", getEntry, (req, res) => {
  if (!res.found) {
    res
    .status(201)
    .json({ isValid: false })
    return
  }
  // If the code has been used
  if (res.entry.firstAccessTime) {
    const startTime = new Date(time)
    const now = Date.now()
    const daysOfAge = (now - startTime) / 3600 / 24 / 7
    console(daysOfAge)
  }
  // If the code exists but has not been used
  if (!res.entry.firstAccessTime) {
    send()

    // const entry = {
    //   username: req.body.username, 
    //   code: req.body.code
    // }
    // const fullUrl = rootUrl + "coolerDate/code/addFirstAccessTime"
    // request({
    //   url: fullUrl,
    //   method: "POST",
    //   json: true, 
    //   body: entry
    // }, function (error, response, body){
    //     console.log(response); 
    // });

    // // addFirstAccessTime
    // const addedResult = addFirstAccessTime(req.body.username, req.body.code)
    //   .then((res) => {
    //     console.log(res)
    //   })
    // console.log(addedResult)
  }
  res
    .status(201)
    .json({ isValid: true });
});


// Creating new coolerDate code
router.post("/add", getEntry, async (req, res) => {
  if (res.found) {
    res.status(201).json({ message: "/coolerDate/code/add --> Entry exists, do nothing" });
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
    const addedTimeEntry = await Code.findOneAndUpdate(
      {
        username: req.body.username,
        code: req.body.code,
      },
      { firstAccessTime: new Date() }
    ).then((res) => {
      console.log(res)
      if (res === null) return { message: "/coolerDate/code/addFirstAccessTime --> Entry does not exist, do nothing" };
      return res
    });
    res.status(201).json(addedTimeEntry);
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
      if (res === null) return { message: "/coolerDate/code/patchProfileCode --> Entry does not exist, do nothing" };
      return res
    });
    res.status(201).json(patchProfileCode);
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



async function addFirstAccessTime(username, code){
  entry = {
    username: username,
    code: code
  }
  
  const actualResult = await fetch(
    `${rootUrl}/addFirstAccessTime`,
    {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Make sure to serialize your JSON body
      body: JSON.stringify(entry),
    }
  )
  .then((res) => {
    return res.json();
  });

  return actualResult;
}


module.exports = router;
