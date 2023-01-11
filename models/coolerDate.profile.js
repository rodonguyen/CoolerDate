const mongoose = require('mongoose')

const coolerDateProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  profileCode: {
    type: String,
    required: true
  },
  content: {
    type: JSON,
    required: true,
  }},
  {collection: 'profile'}
)

module.exports = mongoose.model('coolerdate_profile', coolerDateProfileSchema)