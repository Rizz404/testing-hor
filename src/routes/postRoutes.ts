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
import verifyJwt from "../middleware/verifyJwt";
import { upload, uploadManyToFirebase } from "../middleware/firebaseStorageConfig";

const router = express.Router();

// * prefixnya /posts

router.get("/", getPosts);
router.post("/", verifyJwt, upload.array("images", 7), uploadManyToFirebase, createPost);
router.get("/search", searchPostsByTitle);
router.get("/saved", verifyJwt, getSavedPosts);
router.get("/self", verifyJwt, getSelfPosts);
router.patch("/save/:postId", verifyJwt, savePost);
router.patch("/upvote/:postId", verifyJwt, upvotePost); // * Undo and redo
router.patch("/downvote/:postId", verifyJwt, downvotePost); // * Undo and redo
router.route("/:postId").get(verifyJwt, getPost).delete(verifyJwt, deletePost);

export default router;
