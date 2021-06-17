const mongoose = require("mongoose");

const TravelSchema = new mongoose.Schema({
  name: String,
  location: String,
  date: String,
  comments: String,
  Owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listOfServices: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Service",
    },
  ],
});

const Travel = mongoose.model("Travel", TravelSchema);

module.exports = Travel;
