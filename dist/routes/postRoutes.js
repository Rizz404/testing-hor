"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postControllers_1 = require("../controllers/postControllers");
const express_1 = __importDefault(require("express"));
const verifyJwt_1 = __importDefault(require("../middleware/verifyJwt"));
const firebaseStorageConfig_1 = require("../middleware/firebaseStorageConfig");
const router = express_1.default.Router();
// * prefixnya /posts
router.get("/", postControllers_1.getPosts);
router.post("/", verifyJwt_1.default, firebaseStorageConfig_1.upload.array("images", 7), firebaseStorageConfig_1.uploadManyToFirebase, postControllers_1.createPost);
router.get("/search", postControllers_1.searchPostsByTitle);
router.get("/saved", verifyJwt_1.default, postControllers_1.getSavedPosts);
router.get("/self", verifyJwt_1.default, postControllers_1.getSelfPosts);
router.patch("/save/:postId", verifyJwt_1.default, postControllers_1.savePost);
router.patch("/upvote/:postId", verifyJwt_1.default, postControllers_1.upvotePost); // * Undo and redo
router.patch("/downvote/:postId", verifyJwt_1.default, postControllers_1.downvotePost); // * Undo and redo
router.route("/:postId").get(verifyJwt_1.default, postControllers_1.getPost).delete(verifyJwt_1.default, postControllers_1.deletePost);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map