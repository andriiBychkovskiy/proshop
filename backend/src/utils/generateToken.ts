import jwt from "jsonwebtoken";
import { type Response } from "express";

//Set JWT as HTTP-Only cookie

const generateToken = (id: string, res: Response) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  const token = jwt.sign({ userId: id }, jwtSecret, {
    expiresIn: "30d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in miliseconds
  });
};
export default generateToken;
