"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var postControllers_1 = require("../controllers/postControllers");
var express_1 = __importDefault(require("express"));
var multerConfig_1 = __importDefault(require("../middleware/multerConfig"));
var verifyJwt_1 = __importDefault(require("../middleware/verifyJwt"));
var router = express_1.default.Router();
// * prefixnya /posts
router.get("/", postControllers_1.getPosts);
router.post("/", verifyJwt_1.default, multerConfig_1.default.array("images", 7), postControllers_1.createPost);
router.get("/search", postControllers_1.searchPostsByTitle);
router.get("/saved", verifyJwt_1.default, postControllers_1.getSavedPosts);
router.get("/self", verifyJwt_1.default, postControllers_1.getSelfPosts);
router.patch("/save/:postId", verifyJwt_1.default, postControllers_1.savePost);
router.patch("/upvote/:postId", verifyJwt_1.default, postControllers_1.upvotePost); // * Undo and redo
router.patch("/downvote/:postId", verifyJwt_1.default, postControllers_1.downvotePost); // * Undo and redo
router.route("/:postId").get(verifyJwt_1.default, postControllers_1.getPost).delete(verifyJwt_1.default, postControllers_1.deletePost);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map