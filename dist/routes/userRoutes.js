"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userControllers_1 = require("../controllers/userControllers");
var multerConfig_1 = __importDefault(require("../middleware/multerConfig"));
var verifyJwt_1 = __importDefault(require("../middleware/verifyJwt"));
var router = express_1.default.Router();
// * prefixnya user
router.get("/", userControllers_1.getUsers);
router
    .route("/profile")
    .get(verifyJwt_1.default, userControllers_1.getUserProfile)
    .patch(verifyJwt_1.default, multerConfig_1.default.single("profilePict"), userControllers_1.updateUserProfile);
router.get("/following", verifyJwt_1.default, userControllers_1.getFollowings);
router.get("/followers", verifyJwt_1.default, userControllers_1.getFollowers);
router.patch("/follow/:userId", verifyJwt_1.default, userControllers_1.followUser); // * Undo and redo
// * No auth
router.get("/search", userControllers_1.searchUsers);
router.get("/:userId", userControllers_1.getUserById);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map