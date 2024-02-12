"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins_1 = __importDefault(require("../config/allowedOrigins"));
const credentials = (req, res, next) => {
    const { origin } = req.headers;
    if (allowedOrigins_1.default.includes(origin || "")) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        next();
    }
    else {
        res.status(403).send("Origin not allowed");
    }
};
exports.default = credentials;
//# sourceMappingURL=credentials.js.map