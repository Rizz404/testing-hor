"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var path_1 = __importDefault(require("path"));
var firebaseServiceAccountPath = path_1.default.join(__dirname, "../../happiness-overload-firebase-adminsdk-c7rx1-0e8a0275b5.json");
var firebaseServiceAccount = require(firebaseServiceAccountPath);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebaseServiceAccount),
    databaseURL: "https://happiness-overload-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "happiness-overload.appspot.com",
});
exports.bucket = firebase_admin_1.default.storage().bucket();
exports.default = firebase_admin_1.default;
//# sourceMappingURL=firebaseConfig.js.map