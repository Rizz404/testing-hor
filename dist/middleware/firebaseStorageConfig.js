"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadManyToFirebase = exports.uploadToFirebase = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const firebaseConfig_1 = require("../config/firebaseConfig");
const uuid_1 = require("uuid");
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 10024 }, // * max 10 mb
});
const uploadToFirebase = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file)
            return next();
        const folder = file.mimetype.startsWith("image/") ? "images" : "videos";
        const filename = `${folder}/${(0, uuid_1.v4)()}-${file.originalname}`;
        const firebaseFile = firebaseConfig_1.bucket.file(filename);
        const blobStream = firebaseFile.createWriteStream({
            metadata: { contentType: file.mimetype },
        });
        // * Menggunakan Promise untuk menangani stream
        const streamEnded = new Promise((resolve, reject) => {
            // * Kalo gagal
            blobStream.on("error", reject);
            // * Kalo berhasil
            blobStream.on("finish", () => {
                // @ts-ignore
                file.fileUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig_1.bucket.name}/o/${encodeURIComponent(filename)}?alt=media`;
                resolve();
            });
        });
        blobStream.end(file.buffer);
        // * Tunggu stream selesai
        await streamEnded;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.uploadToFirebase = uploadToFirebase;
const uploadManyToFirebase = async (req, res, next) => {
    try {
        const files = req.files;
        if (!files || !Array.isArray(files))
            return next();
        // * Membuat array untuk menyimpan semua promise
        const promises = files.map(async (file) => {
            const folder = file.mimetype.startsWith("image/") ? "images" : "videos";
            const filename = `${folder}/${(0, uuid_1.v4)()}-${file.originalname}`;
            const firebaseFile = firebaseConfig_1.bucket.file(filename);
            const blobStream = firebaseFile.createWriteStream({
                metadata: { contentType: file.mimetype },
            });
            // * Menggunakan Promise untuk menangani stream
            return new Promise((resolve, reject) => {
                blobStream.on("error", reject);
                blobStream.on("finish", () => {
                    // * File berhasil diunggah ke Firebase Storage
                    // @ts-ignore
                    file.fileUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig_1.bucket.name}/o/${encodeURIComponent(filename)}?alt=media`;
                    resolve();
                });
                blobStream.end(file.buffer);
            });
        });
        // * Menunggu semua file diunggah
        await Promise.all(promises);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.uploadManyToFirebase = uploadManyToFirebase;
//# sourceMappingURL=firebaseStorageConfig.js.map