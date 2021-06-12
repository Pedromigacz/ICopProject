exports.register = (req, res, next) => {
  res.send("register Route");
};

exports.login = (req, res, next) => {
  res.send("login Route");
};

exports.forgotPassword = (req, res, next) => {
  res.send("forgotPassword Route");
};

exports.resetPassword = (req, res, next) => {
  res.send("resetPassword Route");
};
