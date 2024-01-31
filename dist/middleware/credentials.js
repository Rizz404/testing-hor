"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var allowedOrigins_1 = __importDefault(require("../config/allowedOrigins"));
var credentials = function (req, res, next) {
    var origin = req.headers.origin;
    if (allowedOrigins_1.default.includes(origin || "")) {
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    }
    next();
};
exports.default = credentials;
//# sourceMappingURL=credentials.js.map