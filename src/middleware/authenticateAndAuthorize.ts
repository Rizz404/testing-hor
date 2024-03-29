import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import { Types } from "mongoose";

interface ReqUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  roles: "Admin" | "User";
}

declare global {
  namespace Express {
    interface Request {
      user: ReqUser;
    }
  }
}

const authenticateAndAuthorize: (allowedRoles: Array<"Admin" | "User">) => RequestHandler =
  (allowedRoles) => async (req, res, next) => {
    try {
      const token = req.cookies.jwt;

      if (!token) return res.status(401).json({ message: "No token included" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;

      if (!decoded.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = await User.findById(decoded.userId).select("_id username email roles");

      const { roles } = req.user;

      if (!allowedRoles) {
        return res.status(403).json({ message: "No role is allowed" });
      }

      if (!allowedRoles.includes(roles)) {
        return res.status(403).json({ message: `Only ${allowedRoles.join(", ")} are allowed` });
      }

      next();
    } catch (error) {
      res.status(401).json(error);
    }
  };

export default authenticateAndAuthorize;
