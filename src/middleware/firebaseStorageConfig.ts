import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import getErrorMessage from "../utils/getErrorMessage";
import { bucket } from "../config/firebaseConfig";
import { RequestWithUpload } from "../types/express";

const uploadFilesToFirebase: RequestHandler = async (req: RequestWithUpload, res, next) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [req.file];

    if (!files) return next();

    const urls = await Promise.all(
      files.map(async (file) => {
        if (!file) return;

        const blob = bucket.file(uuidv4() + file.originalname);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        return new Promise((resolve, reject) => {
          blobStream.on("error", (err) => {
            reject(err);
          });

          blobStream.on("finish", () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
              bucket.name
            }/o/${encodeURI(blob.name)}?alt=media`;
            resolve(publicUrl);
          });

          blobStream.end(file.buffer);
        });
      })
    );

    req.fileUrls = urls as string[];
    next();
  } catch (error) {
    getErrorMessage(error);
  }
};

export default uploadFilesToFirebase;
