const mongoose = require('mongoose')

const coolerDateProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  profile: {    // Note: Must have 1 profile = 'default'
    type: String,
    required: true
  },
  content: {
    type: Array,
    required: true,
  }},
  {collection: 'profile'}
)

module.exports = mongoose.model('coolerdate_profile', coolerDateProfileSchema)