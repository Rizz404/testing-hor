import { Schema, SchemaTypes, model } from "mongoose";
const PostSchema = new Schema({
    userId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, index: true },
    tags: { type: [SchemaTypes.ObjectId], ref: "Tag", required: true, default: [] },
    images: { type: [String] },
    description: { type: String },
    upvotes: {
        count: { type: Number, default: 0 },
        user: { type: [SchemaTypes.ObjectId], ref: "User", default: [] },
    },
    downvotes: {
        count: { type: Number, default: 0 },
        user: { type: [SchemaTypes.ObjectId], ref: "User", default: [] },
    },
    commentsCount: { type: Number, default: 0 },
}, { timestamps: true });
export default model("Post", PostSchema);
//# sourceMappingURL=Post.js.map