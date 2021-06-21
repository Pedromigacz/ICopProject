const Service = require("../models/Service.js");
const mongoose = require("mongoose");

exports.getPrivateService = async (req, res, next) => {
  let service;
  try {
    service = await Service.findById(req.params.serviceId);
  } catch (error) {
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: service,
  });
};

exports.postService = async (req, res, next) => {
  if (!req.body || !req.body.service) {
    return next(new ErrorResponse("missing service", 400));
  }

  const service = req.body.service;

  let savedService;

  try {
    savedService = await Service.create({
      name: service.name,
      price: service.price,
      brand: service.brand,
      date: service.date,
      address: service.address,
      description: service.description,
      comments: service.comments,
      owner: mongoose.Types.ObjectId(service.ownerId),
    });
  } catch (error) {
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: "service created successfully",
    serviceId: savedService._id,
  });
};

  res.status(200).json({
    success: true,
    data: "You got access to some private data",
  });
};
