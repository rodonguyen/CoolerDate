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
      default: 'null',
    },
    place: {
      type: String,
      required: 'null',
    },
    dressing: {
      type: String,
      required: 'null',
    },
    boyfriend: {
      type: String,
      required: 'null',
    },
  },
  { collection: "respondent" }
);

module.exports = mongoose.model(
  "coolerdate_respondent",
  coolerDateRespondentSchema
);
