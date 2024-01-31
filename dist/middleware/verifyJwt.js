"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token)
            return res.status(401).json({ message: "No token included" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        if (!decoded.userId) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = await User_1.default.findById(decoded.userId).select("_id username email roles");
        next();
    }
    catch (error) {
        res.status(401).json(error);
    }
};
exports.default = verifyJwt;
//# sourceMappingURL=verifyJwt.js.map