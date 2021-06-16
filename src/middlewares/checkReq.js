const express = require("express");

exports.jsonHeaderVerifier = (req, res, next) => {
  if (req.accepts("json")) return next();
  res.status(400).send({
    errorMessage: "pelse, include the right JSON header on your request!",
  });
};

exports.jsonBodyVerifierAndParser = (req, res, next) => {
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        if (req.method === "GET") return;
        JSON.parse(buf);
      } catch (e) {
        res
          .status(400)
          .send({ errorMessage: "Input data must be on JSON format!" });
      }
    },
  });
};
