import { type Request, type Response, type NextFunction } from "express";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModal.js";
import jwt from "jsonwebtoken";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

//Protect routs
const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.jwt;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const userId =
          typeof decoded === "object" && decoded !== null && "userId" in decoded
            ? (decoded as { userId: string }).userId
            : null;
        if (!userId) {
          res.status(401);
          return res.json({ message: "Not authorized, invalid token payload" });
        }
        req.user = await User.findById(userId).select("-password");
        next();
      } catch (err) {
        console.log(err);
        res.status(401);
        res.json({ message: "Not authorized, token failed" });
      }
    } else {
      res.status(401);
      res.json({ message: "Not authorized, no token" });
    }
  }
);

const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    res.json({ message: "Not authorized as Admin" });
  }
};

export { protect, admin };
