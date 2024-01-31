"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tagControllers_1 = require("../controllers/tagControllers");
const express_1 = __importDefault(require("express"));
const verifyJwt_1 = __importDefault(require("../middleware/verifyJwt"));
const router = express_1.default.Router();
router.route("/").get(tagControllers_1.getTags).post(verifyJwt_1.default, tagControllers_1.createTag);
router.get("/search", tagControllers_1.searchTagsByName);
router.patch("/follow/:tagId", verifyJwt_1.default, tagControllers_1.followTag);
router.patch("/block/:tagId", verifyJwt_1.default, tagControllers_1.blockTag);
router.get("/:name", tagControllers_1.getPostsByTagName);
router.get("/:tagId", tagControllers_1.getTag);
exports.default = router;
//# sourceMappingURL=tagRoutes.js.map