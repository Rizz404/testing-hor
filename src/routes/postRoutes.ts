import {
  createPost,
  getPost,
  deletePost,
  searchPostsByTitle,
  getPosts,
  upvotePost,
  downvotePost,
  savePost,
  getSavedPosts,
  getSelfPosts,
} from "../controllers/postControllers";
import express from "express";
import authenticateAndAuthorize from "../middleware/authenticateAndAuthorize";
import { upload, uploadManyToFirebase } from "../middleware/firebaseStorageConfig";

const router = express.Router();

// * prefixnya /posts

router.get("/", getPosts);
router.post(
  "/",
  authenticateAndAuthorize(["User", "Admin"]),
  upload.array("images", 7),
  uploadManyToFirebase,
  createPost
);
router.get("/search", searchPostsByTitle);
router.get("/saved", authenticateAndAuthorize(["User", "Admin"]), getSavedPosts);
router.get("/self", authenticateAndAuthorize(["User", "Admin"]), getSelfPosts);
router.patch("/save/:postId", authenticateAndAuthorize(["User", "Admin"]), savePost);
router.patch("/upvote/:postId", authenticateAndAuthorize(["User", "Admin"]), upvotePost); // * Undo and redo
router.patch("/downvote/:postId", authenticateAndAuthorize(["User", "Admin"]), downvotePost); // * Undo and redo
router
  .route("/:postId")
  .get(getPost)
  .delete(authenticateAndAuthorize(["User", "Admin"]), deletePost);

export default router;
