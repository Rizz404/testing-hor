import { Schema, SchemaTypes, model } from "mongoose";
const TagSchema = new Schema({
    name: { type: String, unique: true, index: true, required: true },
    posts: { type: [SchemaTypes.ObjectId], ref: "Post", default: [] },
    description: { type: String },
    postsCount: { type: Number, default: 0 },
}, { timestamps: true });
export default model("Tag", TagSchema);
//# sourceMappingURL=Tag.js.map