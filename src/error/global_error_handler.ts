import { Request, Response, NextFunction } from "express";

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err: any, res: Response) => {
  // Errors created by me
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //Programming or unknown error
  else {
    console.error("ERROR!💥💥💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong :(",
    });
  }
};

export default function errorControler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // if (config.NODE_ENV === "development") {
  //   sendErrorDev(err, res);
  // } else if (config.NODE_ENV === "production") {
  //   sendErrorProd(err, res);
  // }
  sendErrorProd(err, res);
}
