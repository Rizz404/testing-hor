"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var PostSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, index: true },
    tags: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "Tag", required: true, default: [] },
    images: { type: [String] },
    description: { type: String },
    upvotes: {
        count: { type: Number, default: 0 },
        user: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "User", default: [] },
    },
    downvotes: {
        count: { type: Number, default: 0 },
        user: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "User", default: [] },
    },
    commentsCount: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Post", PostSchema);
//# sourceMappingURL=Post.js.map