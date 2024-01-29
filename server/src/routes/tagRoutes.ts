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
import verifyJwt from "../middleware/verifyJwt";

const router = express.Router();

router.route("/").get(getTags).post(verifyJwt, createTag);
router.get("/search", searchTagsByName);
router.patch("/follow/:tagId", verifyJwt, followTag);
router.patch("/block/:tagId", verifyJwt, blockTag);
router.get("/:name", getPostsByTagName);
router.get("/:tagId", getTag);

export default router;
