import multer from "multer";
import { bucket } from "../config/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 10024 }, // * max 10 mb
});
export const uploadToFirebase = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file)
            return next();
        const folder = file.mimetype.startsWith("image/") ? "images" : "videos";
        const filename = `${folder}/${uuidv4()}-${file.originalname}`;
        const firebaseFile = bucket.file(filename);
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
                file.fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media`;
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
export const uploadManyToFirebase = async (req, res, next) => {
    try {
        const files = req.files;
        if (!files || !Array.isArray(files))
            return next();
        // * Membuat array untuk menyimpan semua promise
        const promises = files.map(async (file) => {
            const folder = file.mimetype.startsWith("image/") ? "images" : "videos";
            const filename = `${folder}/${uuidv4()}-${file.originalname}`;
            const firebaseFile = bucket.file(filename);
            const blobStream = firebaseFile.createWriteStream({
                metadata: { contentType: file.mimetype },
            });
            // * Menggunakan Promise untuk menangani stream
            return new Promise((resolve, reject) => {
                blobStream.on("error", reject);
                blobStream.on("finish", () => {
                    // * File berhasil diunggah ke Firebase Storage
                    // @ts-ignore
                    file.fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media`;
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
//# sourceMappingURL=firebaseStorageConfig.js.map