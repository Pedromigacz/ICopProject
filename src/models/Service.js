const mongoose = require("mongoose");
const ErrorResponse = require("../utils/errorResponse.js");
const cloudinary = require("cloudinary").v2;

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
  listOfImages: [Object],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Travel",
    required: [true, "Each service must have a (travel) owner!"],
  },
});

// SERVICE PRE HOOKS
ServiceSchema.pre("save", async function (next) {
  try {
    const travelOwner = await mongoose.model("Travel").findById(this.owner);
    if (!travelOwner) {
      next(new ErrorResponse("Travel not found", 404));
    }
    if (
      travelOwner.listOfServices.some((listedService) => {
        return listedService._id.equals(this._id);
      })
    ) {
      travelOwner.listOfServices.push(this._id);
    }

    travelOwner.save();
  } catch (error) {
    return next(error);
  }
  next();
});

ServiceSchema.pre("remove", async function (next) {
  try {
    // remove its ref from travelOwner
    const travelThatOwn = await mongoose
      .model("Travel")
      .findByIdAndUpdate(this.owner._id, {
        $pull: { listOfServices: this._id },
      });

    if (!travelThatOwn) {
      return next(
        new ErrorResponse(
          "internal server erro, please, contact us and we'll solve this issue as soon as possible",
          500
        )
      );
    }

    // delete all images before delete this document
    if (this.listOfImages.length > 0) {
      for (const img of this.listOfImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }
  } catch (error) {
    return next(error);
  }
  next();
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
