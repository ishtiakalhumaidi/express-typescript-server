import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized: No token provided",
        });
      }
      const decode = jwt.verify(token, config.secret as string) as JwtPayload;
      req.user = decode;
      if (roles.length && !roles.includes(decode.role)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized!",
        });
      }
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
