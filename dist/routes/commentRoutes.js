"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var commentControllers_1 = require("../controllers/commentControllers");
var verifyJwt_1 = __importDefault(require("../middleware/verifyJwt"));
var multerConfig_1 = __importDefault(require("../middleware/multerConfig"));
var router = express_1.default.Router();
// * Dibawah sini adalah routes yang harus login dulu
router.use(verifyJwt_1.default);
// * Ilmu baru yaitu optional params dengan ?
router.route("/create/:postId/:parentId?").post(verifyJwt_1.default, multerConfig_1.default.single("image"), commentControllers_1.createComment);
router.route("/post/:postId").get(commentControllers_1.getPostComments);
router.get("/replies/:commentId", commentControllers_1.getReplies);
router.patch("/upvote/:commentId", verifyJwt_1.default, commentControllers_1.upvoteComment); // * Undo and redo
router.patch("/downvote/:commentId", verifyJwt_1.default, commentControllers_1.downvoteComment); // * Undo and redo
router
    .route("/:commentId")
    .get(commentControllers_1.getComment)
    .patch(verifyJwt_1.default, commentControllers_1.updateComment)
    .delete(verifyJwt_1.default, commentControllers_1.deleteComment);
exports.default = router;
//# sourceMappingURL=commentRoutes.js.map