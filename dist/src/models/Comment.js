import { Schema, SchemaTypes, model } from "mongoose";
const CommentSchema = new Schema({
    parentId: { type: SchemaTypes.ObjectId, ref: "Comment" },
    userId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    postId: { type: SchemaTypes.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    image: { type: String },
    upvotes: {
        user: { type: [SchemaTypes.ObjectId], ref: "User", default: [] },
        count: { type: Number, default: 0 },
    },
    downvotes: {
        user: { type: [SchemaTypes.ObjectId], ref: "User", default: [] },
        count: { type: Number, default: 0 },
    },
    repliesCounts: { type: Number, default: 0 },
}, { timestamps: true });
export default model("Comment", CommentSchema);
//# sourceMappingURL=Comment.js.map