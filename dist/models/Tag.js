"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TagSchema = new mongoose_1.Schema({
    name: { type: String, unique: true, index: true, required: true },
    posts: { type: [mongoose_1.SchemaTypes.ObjectId], ref: "Post", default: [] },
    description: { type: String },
    postsCount: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Tag", TagSchema);
//# sourceMappingURL=Tag.js.map