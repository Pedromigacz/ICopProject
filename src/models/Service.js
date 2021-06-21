const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "each service must have a name!"],
  },
  price: String,
  brand: String,
  date: String,
  address: String,
  description: String,
  comments: String,
  listOfImages: [String],
  owner: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Travel",
    required: [true, "Each service must have a (travel) owner!"],
  },
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
