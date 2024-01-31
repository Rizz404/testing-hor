"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.searchPostsByTitle = exports.savePost = exports.downvotePost = exports.upvotePost = exports.getPost = exports.getSelfPosts = exports.getSavedPosts = exports.getPosts = exports.createPost = void 0;
var Post_1 = __importDefault(require("../models/Post"));
var User_1 = __importDefault(require("../models/User"));
var Tag_1 = __importDefault(require("../models/Tag"));
var mongoose_1 = require("mongoose");
var deleteFile_1 = __importDefault(require("../utils/deleteFile"));
var Comment_1 = __importDefault(require("../models/Comment"));
var getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
var createPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, _a, title, tags, description, images, newPost, savedPost_1, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _id = req.user._id;
                _a = req.body, title = _a.title, tags = _a.tags, description = _a.description;
                images = req.files;
                newPost = new Post_1.default(__assign(__assign({ userId: _id, title: title, tags: tags }, (images &&
                    images.length !== 0 && {
                    images: images.map(function (image) { return image.filename; }),
                })), (description && { description: description })));
                return [4 /*yield*/, newPost.save()];
            case 1:
                savedPost_1 = _b.sent();
                tags.forEach(function (_id) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Tag_1.default.findByIdAndUpdate({ _id: _id }, { $push: { posts: savedPost_1._id }, $inc: { postsCount: 1 } })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                res.json(savedPost_1);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_1) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createPost = createPost;
var getPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, category, userId, skip, posts, totalData, totalPages, _d, error_2;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 18, , 19]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, category = _a.category, userId = _a.userId;
                skip = (Number(page) - 1) * Number(limit);
                posts = void 0;
                totalData = void 0;
                totalPages = void 0;
                _d = category;
                switch (_d) {
                    case "home": return [3 /*break*/, 1];
                    case "top": return [3 /*break*/, 4];
                    case "trending": return [3 /*break*/, 7];
                    case "fresh": return [3 /*break*/, 10];
                    case "user": return [3 /*break*/, 13];
                }
                return [3 /*break*/, 16];
            case 1: return [4 /*yield*/, Post_1.default.find()
                    .limit(Number(limit))
                    .skip(skip)
                    .populate("userId", "username email profilePict")
                    .populate("tags", "name")];
            case 2:
                // * Ambil semua posts untuk halaman home
                posts = _e.sent();
                return [4 /*yield*/, Post_1.default.countDocuments()];
            case 3:
                totalData = _e.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                return [3 /*break*/, 17];
            case 4: return [4 /*yield*/, Post_1.default.find()
                    .sort({ "upvotes.count": -1 })
                    .limit(Number(limit))
                    .skip(skip)
                    .populate("userId", "username email profilePict")
                    .populate("tags", "name")];
            case 5:
                // * Ambil posts dengan upvotes terbanyak
                posts = _e.sent();
                return [4 /*yield*/, Post_1.default.countDocuments()];
            case 6:
                totalData = _e.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                return [3 /*break*/, 17];
            case 7: return [4 /*yield*/, Post_1.default.find()
                    .sort({ commentsCount: -1 })
                    .limit(Number(limit))
                    .skip(skip)
                    .populate("userId", "username email profilePict")
                    .populate("tags", "name")];
            case 8:
                // * Ambil posts berdasarkan kriteria trending, posts dengan komentar terbanyak
                posts = _e.sent();
                return [4 /*yield*/, Post_1.default.countDocuments()];
            case 9:
                totalData = _e.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                return [3 /*break*/, 17];
            case 10: return [4 /*yield*/, Post_1.default.find()
                    .sort({ createdAt: -1 })
                    .limit(Number(limit))
                    .skip(skip)
                    .populate("userId", "username email profilePict")
                    .populate("tags", "name")];
            case 11:
                // * Ambil posts terbaru
                posts = _e.sent();
                return [4 /*yield*/, Post_1.default.countDocuments()];
            case 12:
                totalData = _e.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                return [3 /*break*/, 17];
            case 13: return [4 /*yield*/, Post_1.default.find({ userId: userId })
                    .limit(Number(limit))
                    .skip(skip)
                    .populate("userId", "username email profilePict")
                    .populate("tags", "name")];
            case 14:
                // * Ambil posts dari user tertentu
                posts = _e.sent();
                return [4 /*yield*/, Post_1.default.countDocuments({ userId: userId })];
            case 15:
                totalData = _e.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                return [3 /*break*/, 17];
            case 16: return [2 /*return*/, res.status(400).json({ message: "Invalid category" })];
            case 17:
                res.json({
                    data: posts,
                    category: category,
                    pagination: {
                        currentPage: page,
                        dataPerPage: limit,
                        totalPages: totalPages,
                        totalData: totalData,
                        hasNextPage: Number(page) < totalPages,
                    },
                    links: {
                        previous: Number(page) > 1
                            ? "/posts?category=".concat(category, "?page=").concat(Number(page) - 1, "&limit=").concat(Number(limit))
                            : null,
                        next: Number(page) < totalPages
                            ? "/posts?category=".concat(category, "?page=").concat(Number(page) + 1, "&limit=").concat(Number(limit))
                            : null,
                    },
                });
                return [3 /*break*/, 19];
            case 18:
                error_2 = _e.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_2) });
                return [3 /*break*/, 19];
            case 19: return [2 /*return*/];
        }
    });
}); };
exports.getPosts = getPosts;
var getSavedPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, _a, _b, page, _c, limit, skip, user, savedPost, posts, totalData, totalPages, error_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _id = req.user._id;
                _a = req.query, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c;
                skip = (Number(page) - 1) * Number(limit);
                return [4 /*yield*/, User_1.default.findById(_id)];
            case 1:
                user = _d.sent();
                savedPost = user === null || user === void 0 ? void 0 : user.social.savedPosts;
                return [4 /*yield*/, Post_1.default.find({ _id: { $in: savedPost } })
                        .limit(Number(limit))
                        .skip(skip)
                        .populate("userId", "username email profilePict")
                        .populate("tags", "name")];
            case 2:
                posts = _d.sent();
                totalData = (savedPost === null || savedPost === void 0 ? void 0 : savedPost.length) || 0;
                totalPages = Math.ceil(totalData / Number(limit));
                res.json({
                    data: posts,
                    category: "saved",
                    pagination: {
                        currentPage: page,
                        dataPerPage: limit,
                        totalPages: totalPages,
                        totalData: totalData,
                        hasNextPage: Number(page) < totalPages,
                    },
                    links: {
                        previous: Number(page) > 1 ? "/posts/saved?page=".concat(Number(page) - 1, "&limit=").concat(Number(limit)) : null,
                        next: Number(page) < totalPages
                            ? "/posts/saved?page=".concat(Number(page) + 1, "&limit=").concat(Number(limit))
                            : null,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _d.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_3) });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSavedPosts = getSavedPosts;
var getSelfPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, _a, _b, page, _c, limit, skip, posts, totalData, totalPages, error_4;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _id = req.user._id;
                _a = req.query, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c;
                skip = (Number(page) - 1) * Number(limit);
                return [4 /*yield*/, Post_1.default.find({ userId: _id })
                        .limit(Number(limit))
                        .skip(skip)
                        .populate("userId", "username email profilePict")
                        .populate("tags", "name")];
            case 1:
                posts = _d.sent();
                return [4 /*yield*/, Post_1.default.countDocuments()];
            case 2:
                totalData = _d.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                res.json({
                    data: posts,
                    category: "self",
                    pagination: {
                        currentPage: page,
                        dataPerPage: limit,
                        totalPages: totalPages,
                        totalData: totalData,
                        hasNextPage: Number(page) < totalPages,
                    },
                    links: {
                        previous: Number(page) > 1 ? "/posts/self?page=".concat(Number(page) - 1, "&limit=").concat(Number(limit)) : null,
                        next: Number(page) < totalPages
                            ? "/posts/self?page=".concat(Number(page) + 1, "&limit=").concat(Number(limit))
                            : null,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _d.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_4) });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSelfPosts = getSelfPosts;
var getPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                postId = req.params.postId;
                return [4 /*yield*/, Post_1.default.findById(postId)
                        .populate("userId", "username email profilePict")
                        .populate("tags", "name")];
            case 1:
                post = _a.sent();
                res.json(post);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_5) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPost = getPost;
var upvotePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, postId, post, isUpvote, isDownvote, upvotedPost, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                _id = req.user._id;
                postId = req.params.postId;
                return [4 /*yield*/, Post_1.default.findById(postId)];
            case 1:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ message: "Post not found" })];
                isUpvote = post === null || post === void 0 ? void 0 : post.upvotes.user.includes(_id);
                isDownvote = post === null || post === void 0 ? void 0 : post.downvotes.user.includes(_id);
                upvotedPost = void 0;
                if (!!isUpvote) return [3 /*break*/, 3];
                return [4 /*yield*/, Post_1.default.findByIdAndUpdate({ _id: postId }, __assign({ $push: { "upvotes.user": _id }, $inc: { "upvotes.count": 1 } }, (isDownvote && { $pull: { "downvotes.user": _id }, $inc: { "downvotes.count": -1 } })))];
            case 2:
                upvotedPost = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, Post_1.default.findByIdAndUpdate({ _id: postId }, { $pull: { "upvotes.user": _id }, $inc: { "upvotes.count": -1 } })];
            case 4:
                upvotedPost = _a.sent();
                _a.label = 5;
            case 5:
                if (!exports.upvotePost || upvotedPost === null)
                    return [2 /*return*/];
                upvotedPost.upvotes.count = upvotedPost.upvotes.user.length;
                upvotedPost.downvotes.count = upvotedPost.downvotes.user.length;
                return [4 /*yield*/, upvotedPost.save()];
            case 6:
                _a.sent();
                res.json({
                    message: !isUpvote
                        ? "Successfully upvoted the post with ID: ".concat(postId)
                        : "Successfully removed your upvote from the post with ID: ".concat(postId),
                });
                return [3 /*break*/, 8];
            case 7:
                error_6 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_6) });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.upvotePost = upvotePost;
var downvotePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, postId, post, isDownvote, isUpvote, downvotedPost, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                _id = req.user._id;
                postId = req.params.postId;
                return [4 /*yield*/, Post_1.default.findById(postId)];
            case 1:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ message: "Post not found" })];
                isDownvote = post === null || post === void 0 ? void 0 : post.downvotes.user.includes(_id);
                isUpvote = post === null || post === void 0 ? void 0 : post.upvotes.user.includes(_id);
                downvotedPost = void 0;
                if (!!isDownvote) return [3 /*break*/, 3];
                return [4 /*yield*/, Post_1.default.findByIdAndUpdate({ _id: postId }, __assign({ $push: { "downvotes.user": _id }, $inc: { "downvotes.count": 1 } }, (isUpvote && { $pull: { "upvotes.user": _id }, $inc: { "upvotes.count": -1 } })))];
            case 2:
                downvotedPost = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, Post_1.default.findByIdAndUpdate({ _id: postId }, { $pull: { "downvotes.user": _id }, $inc: { "downvotes.count": -1 } })];
            case 4:
                downvotedPost = _a.sent();
                _a.label = 5;
            case 5:
                if (!exports.upvotePost || downvotedPost === null)
                    return [2 /*return*/];
                downvotedPost.upvotes.count = downvotedPost.upvotes.user.length;
                downvotedPost.downvotes.count = downvotedPost.downvotes.user.length;
                return [4 /*yield*/, downvotedPost.save()];
            case 6:
                _a.sent();
                res.json({
                    message: !isDownvote
                        ? "Successfully downvoted the post with ID: ".concat(postId)
                        : "Successfully removed your downvote from the post with ID: ".concat(postId),
                });
                return [3 /*break*/, 8];
            case 7:
                error_7 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_7) });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.downvotePost = downvotePost;
var savePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, _id, postIdObjId, user, isPostSaved, savedPost, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                postId = req.params.postId;
                _id = req.user._id;
                postIdObjId = new mongoose_1.Types.ObjectId(postId);
                return [4 /*yield*/, User_1.default.findById(_id)];
            case 1:
                user = _a.sent();
                isPostSaved = user === null || user === void 0 ? void 0 : user.social.savedPosts.includes(postIdObjId);
                savedPost = void 0;
                if (!!isPostSaved) return [3 /*break*/, 3];
                return [4 /*yield*/, User_1.default.findByIdAndUpdate({ _id: _id }, { $push: { "social.savedPosts": postIdObjId } })];
            case 2:
                savedPost = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, User_1.default.findByIdAndUpdate({ _id: _id }, { $pull: { "social.savedPosts": postIdObjId } })];
            case 4:
                savedPost = _a.sent();
                _a.label = 5;
            case 5:
                res.json({
                    message: !isPostSaved
                        ? "Successfully saved post with Id ".concat(postId)
                        : "Successfully unsaved post with Id ".concat(postId),
                });
                return [3 /*break*/, 7];
            case 6:
                error_8 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_8) });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.savePost = savePost;
var searchPostsByTitle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, _b, page, limit, skip, posts, _c, error_9;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.query, title = _a.title, _b = _a.page, page = _b === void 0 ? "1" : _b;
                limit = 10;
                skip = (Number(page) - 1) * limit;
                _c = (title === null || title === void 0 ? void 0 : title.toString().trim()) !== "";
                if (!_c) return [3 /*break*/, 2];
                return [4 /*yield*/, Post_1.default.find({ title: { $regex: title, $options: "i" } })
                        .limit(limit)
                        .skip(skip)
                        .populate("userId", "username email profilePict")
                        .populate("tags", "name")];
            case 1:
                _c = (_d.sent());
                _d.label = 2;
            case 2:
                posts = _c;
                res.json(posts);
                return [3 /*break*/, 4];
            case 3:
                error_9 = _d.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_9) });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.searchPostsByTitle = searchPostsByTitle;
var deletePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                postId = req.params.postId;
                return [4 /*yield*/, Post_1.default.findByIdAndDelete(postId)];
            case 1:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(404).json({ message: "Post not found" })];
                if (post.images && post.images.length <= 0) {
                    post.images.forEach(function (image) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, deleteFile_1.default)("images", image)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); });
                }
                return [4 /*yield*/, Comment_1.default.deleteMany({ postId: postId })];
            case 2:
                _a.sent();
                return [4 /*yield*/, User_1.default.updateMany({ "social.savedPosts": postId }, { $pull: { "social.savedPosts": postId } })];
            case 3:
                _a.sent();
                return [4 /*yield*/, Tag_1.default.updateMany({ posts: postId }, { $pull: { posts: postId } })];
            case 4:
                _a.sent();
                res.json({ message: "Successfully deleted post with ID: ".concat(post._id) });
                return [3 /*break*/, 6];
            case 5:
                error_10 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_10) });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deletePost = deletePost;
//# sourceMappingURL=postControllers.js.map