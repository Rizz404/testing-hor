"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const authenticateAndAuthorize_1 = __importDefault(require("../middleware/authenticateAndAuthorize"));
const firebaseStorageConfig_1 = require("../middleware/firebaseStorageConfig");
const router = express_1.default.Router();
// * prefixnya user
router.get("/", userControllers_1.getUsers);
router
    .route("/profile")
    .get((0, authenticateAndAuthorize_1.default)(["User", "Admin"]), userControllers_1.getUserProfile)
    .patch((0, authenticateAndAuthorize_1.default)(["User", "Admin"]), firebaseStorageConfig_1.upload.single("profilePict"), firebaseStorageConfig_1.uploadToFirebase, userControllers_1.updateUserProfile);
router.get("/following", (0, authenticateAndAuthorize_1.default)(["User", "Admin"]), userControllers_1.getFollowings);
router.get("/followers", (0, authenticateAndAuthorize_1.default)(["User", "Admin"]), userControllers_1.getFollowers);
router.patch("/follow/:userId", (0, authenticateAndAuthorize_1.default)(["User", "Admin"]), userControllers_1.followUser); // * Undo and redo
// * No auth
router.get("/search", userControllers_1.searchUsers);
router.get("/:userId", userControllers_1.getUserById);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map