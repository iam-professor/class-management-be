import { NextFunction } from "express";
import { Jwt } from "jsonwebtoken";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import Teacher from "../models/teachersSchema";

export const user = async (req: any, res: any, next: NextFunction) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      let token = req.headers.authorization.split(" ")[1];
    //   const jwtSecret = process.env.JWT_SECRETE;

      //need to update to env
      const decoded = jwt.verify(token, "secrete") as {
        _id: string;
      };

      req.user = await Teacher.findById(decoded._id).select("-password");
      if (!req.user) throw new Error("user is not found");

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res
          .status(401)
          .json({
            message: "Token expired, please log in again.",
            tokenExpired: true,
          });
      } else {
        res.status(401);
        throw new Error("Not authorized, token verification failed");
      }
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided." });
  }
};
