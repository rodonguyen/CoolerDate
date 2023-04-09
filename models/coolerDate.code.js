const mongoose = require("mongoose");

const coolerDateCodeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default: "default",
    },
    firstAccessTime: {
      type: Date,
      default: "",
    },
    hoursTookToSubmit: {
      type: Number,
      default: -1,
    },
  },
  { collection: "code" }
);

module.exports = mongoose.model("coolerdate_code", coolerDateCodeSchema);
