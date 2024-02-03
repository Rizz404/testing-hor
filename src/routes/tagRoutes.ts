import {
  searchTagsByName,
  getTags,
  getPostsByTagName,
  createTag,
  blockTag,
  followTag,
  getTag,
} from "../controllers/tagControllers";
import express from "express";
import authenticateAndAuthorize from "../middleware/authenticateAndAuthorize";

const router = express.Router();

router
  .route("/")
  .get(getTags)
  .post(authenticateAndAuthorize(["User", "Admin"]), createTag);
router.get("/search", searchTagsByName);
router.patch("/follow/:tagId", authenticateAndAuthorize(["User", "Admin"]), followTag);
router.patch("/block/:tagId", authenticateAndAuthorize(["User", "Admin"]), blockTag);
router.get("/:name", getPostsByTagName);
router.get("/:tagId", getTag);

export default router;
