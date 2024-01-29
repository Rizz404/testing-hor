import { Document, Schema, SchemaTypes, Types, model } from "mongoose";

interface IPost {
  userId: Types.ObjectId;
  title: string;
  tags: Types.ObjectId[];
  images?: string[];
  description?: string;
  upvotes: {
    user: Types.ObjectId[];
    count: number;
  };
  downvotes: {
    user: Types.ObjectId[];
    count: number;
  };
  commentsCount: number;
}

export interface PostDocument extends IPost, Document {}

const PostSchema = new Schema<PostDocument>(
  {
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
  },
  { timestamps: true }
);

export default model<PostDocument>("Post", PostSchema);
