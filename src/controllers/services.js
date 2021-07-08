const Service = require("../models/Service.js");
const mongoose = require("mongoose");
const Travel = mongoose.model("Travel");
const ErrorResponse = require("../utils/errorResponse.js");
const cloudinary = require("cloudinary").v2;

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

exports.putScervice = async (req, res, next) => {
  if (!req.params.serviceId) {
    return next(new ErrorResponse("missing params", 400));
  }

  let service;
  try {
    service = await Service.findById(req.params.serviceId);

    // delete all previous images
    if (service.listOfImages.length > 0) {
      for (const img of service.listOfImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // add all new images to listOfImages attribute
    service.listOfImages = [];
    if (req.files.length > 0) {
      service.listOfImages = req.files.map((file) => {
        return { path: file.path, public_id: file.filename };
      });
    }

    if (req.body.name) service.name = req.body.name;
    if (req.body.price) service.price = req.body.price;
    if (req.body.brand) service.brand = req.body.brand;
    if (req.body.date) service.date = req.body.date;
    if (req.body.address) service.address = req.body.address;
    if (req.body.description) service.description = req.body.description;
    if (req.body.comments) service.comments = req.body.comments;

    service.save();
  } catch (error) {
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: "service updated successfully",
    //serviceId: service._id,
  });
};

exports.deleteService = async (req, res, next) => {
  if (!req.params.serviceId) {
    return next(new ErrorResponse("missing service", 400));
  }

  try {
    const service = await Service.findById(req.params.serviceId);

    if (!service) return next(new ErrorResponse("Service not found", 404));

    await service.remove();
  } catch (error) {
    return next(error);
  }
  res.status(200).json({
    success: true,
    data: "service deleted successfully",
  });
};

exports.findServices = async (req, res, next) => {
  if (!req.body.travelName) {
    return next(new ErrorResponse("missing travel name param", 400));
  }

  let owner;
  try {
    owner = await Travel.findOne({ name: req.body.travelName });

    if (!owner) return next(new ErrorResponse("travel not found", 404));

    await owner.populate("listOfServices").execPopulate();
  } catch (error) {
    return next(error);
  }

  res.status(200).json({ success: true, services: [...owner.listOfServices] });
};
