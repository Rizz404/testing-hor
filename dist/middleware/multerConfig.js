"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// * Konfigurasi storage untuk image dan video
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        // * Menentukan folder tujuan berdasarkan field name
        if (file.fieldname === "images" ||
            file.fieldname === "image" ||
            file.fieldname === "profilePict") {
            cb(null, path_1.default.join(__dirname, "../public/assets/images"));
        }
        else if (file.fieldname === "video") {
            cb(null, path_1.default.join(__dirname, "../public/assets/videos"));
        }
    },
    filename: function (req, file, cb) {
        // * Memberi nama file dengan format fieldname-timestamp.extensi
        cb(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
    },
});
// * Konfigurasi filter untuk membatasi tipe file yang diterima
const fileFilter = (req, file, cb) => {
    // * Jika field name adalah images, maka hanya terima file dengan mimetype image
    if (file.fieldname === "images" ||
        file.fieldname === "profilePict" ||
        file.fieldname === "image") {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(null, false);
            const err = new Error("Only image format allowed");
            err.name = "ExtensionError";
            return cb(err);
        }
    }
    // * Jika field name adalah video, maka hanya terima file dengan mimetype video/mp4
    else if (file.fieldname === "video") {
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        }
        else {
            cb(null, false);
            const err = new Error("Only video format allowed!");
            err.name = "ExtensionError";
            return cb(err);
        }
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 10 } });
exports.default = upload;
//# sourceMappingURL=multerConfig.js.map