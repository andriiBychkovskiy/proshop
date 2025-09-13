import { type Request, type Response, type NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = "";

  if (err instanceof Error) {
    message = err.message;
  } else {
    message = String(err);
  }
  if (
    err.name === "CastError" &&
    typeof (err as any).kind === "string" &&
    (err as any).kind === "ObjectId"
  ) {
    message = "Resource not found";
    statusCode = 404;
  }
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? "PRODUCTION" : err.stack,
  });
};
export { notFound, errorHandler };
