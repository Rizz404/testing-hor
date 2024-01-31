"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    parentId: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Comment" },
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: "User", required: true },
    postId: { type: mongoose_1.SchemaTypes.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    image: { type: String },
    upvotes: {
        user: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "User", default: [] },
        count: { type: Number, default: 0 },
    },
    downvotes: {
        user: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "User", default: [] },
        count: { type: Number, default: 0 },
    },
    repliesCounts: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Comment", CommentSchema);
//# sourceMappingURL=Comment.js.map