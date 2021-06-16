exports.jsonHeaderVerifier = (req, res, next) => {
  if (req.accepts("json")) return next();
  res.status(400).send({
    errorMessage: "pelse, include the right JSON header on your request!",
  });
};
