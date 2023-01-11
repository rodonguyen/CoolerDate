const mongoose = require('mongoose')

const coolerDateCodeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  firstAccessTime: {
    type: Date,
    required: false,
    default: ''
  }},
  {collection: 'code'}
)

module.exports = mongoose.model('coolerdate_code', coolerDateCodeSchema)