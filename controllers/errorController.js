const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  //err.path, err.value are comming from mongoose castError.
  const message = `invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError("Invalid token. Please login again", 401);

const handleJwtExpiredError = () =>
  new AppError("Your token has expired. please login again", 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      message: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    //operational error for api calls
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.log(err);
    //programming error or unknown errors api calls
    console.error("Error", err);
    return res.status(500).json({
      status: "error",
      message: "hhmmm... Something went wrong",
    });
  }

  //operational error for renderd page
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      status: err.status,
      message: err.message,
    });
  }

  //programming error or unknown errors for rendered page
  console.error("Error", err);
  res.status(500).render("error", {
    status: "error",
    message: "hhmmm... Something went wrong",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "production") {
    console.log("hello prod");
    console.log(err.name);
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJwtError();
    if (err.name === "TokenExpiredError") error = handleJwtExpiredError();
    sendErrorProd(error, req, res);
  } else {
    let error = { ...err };
    console.log("hello dev");
    sendErrorDev(error, req, res);
  }
};
