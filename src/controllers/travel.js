const ErrorResponse = require("../utils/errorResponse.js");
const Travel = require("../models/Travel.js");
const mongoose = require("mongoose");

exports.getTravel = async (req, res, next) => {
  let travel;
  try {
    travel = await Travel.findById(req.params.travelId);
  } catch (error) {
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: travel,
  });
};

exports.postTravel = async (req, res, next) => {
  if (!req.body || !req.body.travel) {
    return next(new ErrorResponse("missing travel", 400));
  }

  const travel = req.body.travel;

  let savedTravel;

  try {
    savedTravel = await Travel.create({
      name: travel.name,
      location: travel.location,
      date: travel.date,
      comments: travel.comments,
      owner: mongoose.Types.ObjectId(travel.ownerId),
    });
  } catch (error) {
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: "travel created successfully",
    travelId: savedTravel._id,
  });
};

exports.putTravel = async (req, res, next) => {
  if (!req.body || !req.body.travel) {
    return next(new ErrorResponse("missing travel", 400));
  }
  if (!req.params.travelId) {
    return next(new ErrorResponse("missing travelId", 400));
  }

  try {
    const travel = await Travel.findById(req.params.travelId);

    if (!travel) {
      return next(new ErrorResponse("travel not found", 400));
    }

    travel.name = req.body.travel.name ? req.body.travel.name : travel.name;
    travel.location = req.body.travel.location
      ? req.body.travel.location
      : travel.location;
    travel.date = req.body.travel.date ? req.body.travel.date : travel.date;
    travel.comments = req.body.travel.comments
      ? req.body.travel.comments
      : travel.comments;

    await travel.save();
  } catch (error) {
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: "travel updated successfully",
  });
};

exports.deleteTravel = async (req, res, next) => {
  if (!req.params.travelId) {
    return next(new ErrorResponse("missing travel", 400));
  }

  try {
    const travel = await Travel.findById(req.params.travelId);

    if (!travel) return next(new ErrorResponse("travel not found", 404));

    await travel.remove();
  } catch (error) {
    return next(error);
  }
  res.status(200).json({
    success: true,
    data: "travel deleted successfully",
  });
};
