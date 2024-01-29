import { Document, Schema, SchemaTypes, Types, model } from "mongoose";

interface IComment {
  parentId?: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  content: string;
  image?: string;
  upvotes: {
    user: Types.ObjectId[];
    count: number;
  };
  downvotes: {
    user: Types.ObjectId[];
    count: number;
  };
  repliesCounts: number;
}

export interface CommentDocument extends IComment, Document {}

const CommentSchema = new Schema<CommentDocument>(
  {
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
  },
  { timestamps: true }
);

export default model<CommentDocument>("Comment", CommentSchema);
