const mongoose = require('mongoose')

const coolerDateSchema = new mongoose.Schema({
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
  {collection: 'codes'}
)

module.exports = mongoose.model('CoolerDate', coolerDateSchema)