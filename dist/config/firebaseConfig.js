"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert({
        projectId: process.env.PROJECT_ID,
        privateKey: process.env.PRIVATE_KEY,
        clientEmail: process.env.CLIENT_EMAIL,
    }),
    storageBucket: "gs://happiness-overload.appspot.com",
});
exports.bucket = firebase_admin_1.default.storage().bucket();
//# sourceMappingURL=firebaseConfig.js.map