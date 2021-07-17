if (process.env.NODE_ENV !== "production") require("dotenv").config();
const nodemailer = require("nodemailer");
const ErrorResponse = require("./errorResponse.js");

const sendEmail = async (options) => {
  const transporter = await nodemailer.createTransport({
    service: process.env.EMAIL_SERIVCE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return new ErrorResponse(
        "Something went wrong in our server, sorry",
        500
      );
    }
  });
};

module.exports = sendEmail;
