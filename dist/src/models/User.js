import { Schema, SchemaTypes, model } from "mongoose";
const UserSchema = new Schema({
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
        following: { type: [SchemaTypes.ObjectId], ref: "User", default: [] },
        followers: { type: [SchemaTypes.ObjectId], ref: "User", default: [] },
        savedPosts: { type: [SchemaTypes.ObjectId], ref: "Post", default: [] },
        followedTags: { type: [SchemaTypes.ObjectId], ref: "Tag", default: [] },
        blockedTags: { type: [SchemaTypes.ObjectId], ref: "Tag", default: [] },
    },
}, { timestamps: true });
export default model("User", UserSchema);
//# sourceMappingURL=User.js.map