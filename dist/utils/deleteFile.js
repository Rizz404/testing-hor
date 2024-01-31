"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises")); // * yang asli ada promisenya
const path_1 = __importDefault(require("path"));
const deleteFile = async (pathFolder, filename) => {
    try {
        const filePath = path_1.default.join(__dirname, `../public/assets/${pathFolder}/${filename}`);
        await promises_1.default.unlink(filePath);
        console.log(`File ${filename} deleted successfully.`);
    }
    catch (error) {
        throw new Error(`Error deleting file: ${error}`);
    }
};
exports.default = deleteFile;
//# sourceMappingURL=deleteFile.js.map