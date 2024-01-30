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
import verifyJwt from "../middleware/verifyJwt";
import upload from "../middleware/multerConfig";
import uploadFilesToFirebase from "../middleware/firebaseStorageConfig";

const router = express.Router();

// * Dibawah sini adalah routes yang harus login dulu
router.use(verifyJwt);
// * Ilmu baru yaitu optional params dengan ?
router.route("/create/:postId/:parentId?").post(verifyJwt, uploadFilesToFirebase, createComment);
router.route("/post/:postId").get(getPostComments);
router.get("/replies/:commentId", getReplies);
router.patch("/upvote/:commentId", verifyJwt, upvoteComment); // * Undo and redo
router.patch("/downvote/:commentId", verifyJwt, downvoteComment); // * Undo and redo
router
  .route("/:commentId")
  .get(getComment)
  .patch(verifyJwt, updateComment)
  .delete(verifyJwt, deleteComment);

export default router;
