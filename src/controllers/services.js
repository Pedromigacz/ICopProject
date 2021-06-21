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
  res.status(200).json({
    success: true,
    data: "You got access to some private data",
  });
};
