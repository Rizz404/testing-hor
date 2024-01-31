"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var allowedOrigins_1 = __importDefault(require("../config/allowedOrigins"));
var corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins_1.default.indexOf(origin || "") !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by cors"));
        }
    },
    optionsSuccessStatus: 200,
};
exports.default = corsOptions;
//# sourceMappingURL=corsConfig.js.map