"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 5 },
    roles: { type: String, enum: ["Admin", "User"], default: "User" },
    fullname: { type: String, maxlength: 100 },
    profilePict: { type: String },
    phoneNumber: { type: Number },
    isOauth: { type: Boolean, required: true },
    lastLogin: { type: Date },
    bio: { type: String },
    social: {
        following: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "User", default: [] },
        followers: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "User", default: [] },
        savedPosts: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "Post", default: [] },
        followedTags: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "Tag", default: [] },
        blockedTags: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "Tag", default: [] },
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=User.js.map