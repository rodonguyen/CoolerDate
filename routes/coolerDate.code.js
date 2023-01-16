const express = require("express");
const router = express.Router();
const Code = require("../models/coolerDate.code");

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

module.exports = router;
