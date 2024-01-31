"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logDir = path_1.default.join(__dirname, "../logs");
fs_1.default.existsSync(logDir) || fs_1.default.mkdirSync(logDir);
exports.default = fs_1.default.createWriteStream(path_1.default.join(logDir, "access.log"), { flags: "a" });
//# sourceMappingURL=logger.js.map