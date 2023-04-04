const mongoose = require("mongoose");

const coolerDateRespondentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    // The rest is respondent information
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    ifact: {
      type: String,
      required: false,
    },
    place: {
      type: String,
      required: true,
    },
    dressing: {
      type: String,
      required: false,
    },
    boyfriend: {
      type: String,
      required: true,
    },
  },
  { collection: "respondent" }
);

module.exports = mongoose.model(
  "coolerdate_respondent",
  coolerDateRespondentSchema
);
