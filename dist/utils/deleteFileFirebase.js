"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseConfig_1 = require("../config/firebaseConfig");
const getErrorMessage_1 = __importDefault(require("./getErrorMessage"));
const deleteFileFirebase = async (fileUrl) => {
    try {
        // * Ini regex pelajari lagi
        const matches = fileUrl.match(/https:\/\/firebasestorage.googleapis.com\/v0\/b\/[^\/]+\/o\/([^?]+)/);
        if (!matches)
            throw new Error("Invalid file URL");
        // * Biasanya path file itu biasanya emcode makanya di decode dulu
        const filePath = decodeURIComponent(matches[1]);
        await firebaseConfig_1.bucket.file(filePath).delete();
    }
    catch (error) {
        (0, getErrorMessage_1.default)(error);
    }
};
exports.default = deleteFileFirebase;
//# sourceMappingURL=deleteFileFirebase.js.map