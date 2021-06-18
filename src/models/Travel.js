const mongoose = require("mongoose");
const User = require("./User.js");

const TravelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  location: String,
  date: String,
  comments: String,
  owner: {
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

// TRAVEL PRE HOOKS
TravelSchema.pre("save", async function (next) {
  try {
    const owner = await User.findById(this.owner);
    owner.listOfTravels.push(this._id);

    owner.save();
  } catch (error) {
    return next(error);
  }
  next();
});

const Travel = mongoose.model("Travel", TravelSchema);

module.exports = Travel;
