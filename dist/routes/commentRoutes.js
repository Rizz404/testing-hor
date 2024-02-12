"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentControllers_1 = require("../controllers/commentControllers");
const authenticateAndAuthorize_1 = __importDefault(require("../middleware/authenticateAndAuthorize"));
const firebaseStorageConfig_1 = require("../middleware/firebaseStorageConfig");
const router = express_1.default.Router();
router
    .route("/create/:postId/:parentId?")
    .post((0, authenticateAndAuthorize_1.default)(["User", "Admin"]), firebaseStorageConfig_1.upload.single("image"), firebaseStorageConfig_1.uploadToFirebase, commentControllers_1.createComment);
router.route("/post/:postId").get(commentControllers_1.getPostComments);
router.get("/replies/:commentId", commentControllers_1.getReplies);
router.patch("/upvote/:commentId", (0, authenticateAndAuthorize_1.default)(["User", "Admin"]), commentControllers_1.upvoteComment); // * Undo and redo
router.patch("/downvote/:commentId", (0, authenticateAndAuthorize_1.default)(["User", "Admin"]), commentControllers_1.downvoteComment); // * Undo and redo
router
    .route("/:commentId")
    .get(commentControllers_1.getComment)
    .patch((0, authenticateAndAuthorize_1.default)(["User", "Admin"]), commentControllers_1.updateComment)
    .delete((0, authenticateAndAuthorize_1.default)(["User", "Admin"]), commentControllers_1.deleteComment);
exports.default = router;
//# sourceMappingURL=commentRoutes.js.map