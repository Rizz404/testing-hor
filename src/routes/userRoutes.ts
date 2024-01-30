import express from "express";
import {
  getUsers,
  getUserProfile,
  updateUserProfile,
  getUserById,
  followUser,
  getFollowings,
  getFollowers,
  searchUsers,
} from "../controllers/userControllers";
import upload from "../middleware/multerConfig";
import verifyJwt from "../middleware/verifyJwt";
import uploadFilesToFirebase from "../middleware/firebaseStorageConfig";

const router = express.Router();

// * prefixnya user
router.get("/", getUsers);
router
  .route("/profile")
  .get(verifyJwt, getUserProfile)
  .patch(verifyJwt, uploadFilesToFirebase, updateUserProfile);
router.get("/following", verifyJwt, getFollowings);
router.get("/followers", verifyJwt, getFollowers);
router.patch("/follow/:userId", verifyJwt, followUser); // * Undo and redo

// * No auth
router.get("/search", searchUsers);
router.get("/:userId", getUserById);

export default router;
