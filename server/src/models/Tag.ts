import { Document, Schema, SchemaTypes, Types, model } from "mongoose";

interface ITag {
  name: string;
  posts: Types.ObjectId[];
  description?: string;
  postsCount: number;
}

export interface TagDocument extends ITag, Document {}

const TagSchema = new Schema<TagDocument>(
  {
    name: { type: String, unique: true, index: true, required: true },
    posts: { type: [SchemaTypes.ObjectId], ref: "Post", default: [] },
    description: { type: String },
    postsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<TagDocument>("Tag", TagSchema);
