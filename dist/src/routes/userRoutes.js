import express from "express";
import { getUsers, getUserProfile, updateUserProfile, getUserById, followUser, getFollowings, getFollowers, searchUsers, } from "../controllers/userControllers";
import verifyJwt from "../middleware/verifyJwt";
import { uploadToFirebase, upload } from "../middleware/firebaseStorageConfig";
const router = express.Router();
// * prefixnya user
router.get("/", getUsers);
router
    .route("/profile")
    .get(verifyJwt, getUserProfile)
    .patch(verifyJwt, upload.single("profilePict"), uploadToFirebase, updateUserProfile);
router.get("/following", verifyJwt, getFollowings);
router.get("/followers", verifyJwt, getFollowers);
router.patch("/follow/:userId", verifyJwt, followUser); // * Undo and redo
// * No auth
router.get("/search", searchUsers);
router.get("/:userId", getUserById);
export default router;
//# sourceMappingURL=userRoutes.js.map