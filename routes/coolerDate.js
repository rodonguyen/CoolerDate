const express = require('express')
const router = express.Router()
const CoolerDate = require('../models/coolerDate')

// Getting all coolerDate codes
router.get('/', async (req, res) => {
  // res.send('hello')
  try {
    const codes = await CoolerDate.find()
    res.json(codes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// Creating new coolerDate code
router.post('/add', async (req, res) => {
  console.log(req.body)

  try {
    const newCode = await CoolerDate.create({
      username: req.body.username,
      code: req.body.code
    })
    res.status(201).json(newCode)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
 
// Updating One
router.post('/updateFirstAccessTime', checkUsernameCode, async (req, res) => {

  res.entry.firstAccessTime = new Date()
  try {
    const updatedEntry = await res.entry.save()
    res.json(updatedEntry)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})


async function checkUsernameCode(req, res, next) {
  let entry
  try {
    entry = await CoolerDate.findOne({
      username: req.body.username,
      code: req.body.code,
    })
    // console.log(entry)
    if (entry == null) {
      return res.status(404).json({ message: 'Cannot find entry', entry: entry })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.entry = entry
  next()
}



// // Getting One
// router.get('/:id', getSubscriber, (req, res) => {
//   res.json(res.subscriber)
// })


// Updating One
router.patch('/:id', getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name
  }
  if (req.body.subscribedToChannel != null) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel
  }
  try {
    const updatedSubscriber = await res.subscriber.save()
    res.json(updatedSubscriber)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// // Deleting One
// router.delete('/:id', getSubscriber, async (req, res) => {
//   try {
//     await res.subscriber.remove()
//     res.json({ message: 'Deleted Subscriber' })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// async function getSubscriber(req, res, next) {
//   let subscriber
//   try {
//     subscriber = await Subscriber.findById(req.params.id)
//     if (subscriber == null) {
//       return res.status(404).json({ message: 'Cannot find subscriber' })
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message })
//   }

//   res.subscriber = subscriber
//   next()
// }

module.exports = router