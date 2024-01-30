import { ParamsDictionary, Request } from "express-serve-static-core";
import { ParsedQs } from "qs";

interface ReqParams extends ParamsDictionary {
  userId: string;
  postId: string;
  tagId: string;
  commentId: string;
  parentId: string;
}
