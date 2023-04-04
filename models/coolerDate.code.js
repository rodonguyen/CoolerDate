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
      required: true,
      default: "neutral",
    },
    firstAccessTime: {
      type: Date,
      required: false,
      default: "",
    },
    numberOfClickingSubmitTimes: {
      type: Number,
      required: false,
      default: 0,
    }
  },
  { collection: "code" }
);

module.exports = mongoose.model("coolerdate_code", coolerDateCodeSchema);
