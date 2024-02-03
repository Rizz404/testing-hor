import express from "express";
import {
  createComment,
  deleteComment,
  getComment,
  getPostComments,
  updateComment,
  getReplies,
  upvoteComment,
  downvoteComment,
} from "../controllers/commentControllers";
import authenticateAndAuthorize from "../middleware/authenticateAndAuthorize";
import { uploadToFirebase, upload } from "../middleware/firebaseStorageConfig";

const router = express.Router();

router
  .route("/create/:postId/:parentId?")
  .post(
    authenticateAndAuthorize(["User", "Admin"]),
    upload.single("image"),
    uploadToFirebase,
    createComment
  );
router.route("/post/:postId").get(getPostComments);
router.get("/replies/:commentId", getReplies);
router.patch("/upvote/:commentId", authenticateAndAuthorize(["User", "Admin"]), upvoteComment); // * Undo and redo
router.patch("/downvote/:commentId", authenticateAndAuthorize(["User", "Admin"]), downvoteComment); // * Undo and redo
router
  .route("/:commentId")
  .get(getComment)
  .patch(authenticateAndAuthorize(["User", "Admin"]), updateComment)
  .delete(authenticateAndAuthorize(["User", "Admin"]), deleteComment);

export default router;
