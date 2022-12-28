class ErrorHandler {
  static handle = () => {
    return (err, req, res, next) => {
      console.log("handler okay");
      err.statusCode = err.statusCode || 500;
      err.status = err.status || "error";
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    };
  };
}

module.exports = ErrorHandler;
