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

  try {
  const savedTravel = await Travel.create({
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

exports.putTravel = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "You got access to some private data",
  });
};

exports.deleteTravel = async (req, res, next) => {
  try {
    const travel = await Travel.findById(req.params.travelId);

    if (!travel) return next(new ErrorResponse("travel not found", 404));

    await travel.remove();
  } catch (error) {
    return next(error);
  }
  res.status(200).json({
    success: true,
    data: "travel deleter successfully",
  });
};
