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
exports.downvoteComment = exports.upvoteComment = exports.deleteComment = exports.updateComment = exports.getReplies = exports.getComment = exports.getPostComments = exports.createComment = void 0;
var Comment_1 = __importDefault(require("../models/Comment"));
var Post_1 = __importDefault(require("../models/Post"));
var deleteFile_1 = __importDefault(require("../utils/deleteFile"));
var getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
var createComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, _a, parentId, postId, _b, content, image, newComment, savedComment, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _id = req.user._id;
                _a = req.params, parentId = _a.parentId, postId = _a.postId;
                _b = req.body, content = _b.content, image = _b.image;
                newComment = new Comment_1.default(__assign(__assign(__assign({}, (parentId && { parentId: parentId })), { userId: _id, postId: postId, content: content }), (image && { image: image })));
                return [4 /*yield*/, newComment.save()];
            case 1:
                savedComment = _c.sent();
                return [4 /*yield*/, Post_1.default.findByIdAndUpdate({ _id: postId }, { $inc: { commentsCount: 1 } })];
            case 2:
                _c.sent();
                return [4 /*yield*/, Comment_1.default.findByIdAndUpdate({ _id: parentId }, { $inc: { repliesCounts: 1 } })];
            case 3:
                _c.sent();
                res.json(savedComment);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                res.status(400).json({ messsage: (0, getErrorMessage_1.default)(error_1) });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createComment = createComment;
var getPostComments = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, _a, _b, page, _c, limit, skip, comments, totalData, totalPages, error_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                postId = req.params.postId;
                _a = req.query, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? "20" : _c;
                skip = (Number(page) - 1) * Number(limit);
                return [4 /*yield*/, Comment_1.default.find({ postId: postId })
                        .limit(Number(limit))
                        .skip(skip)
                        .populate("userId", "username email profilePict")];
            case 1:
                comments = _d.sent();
                return [4 /*yield*/, Comment_1.default.countDocuments({ postId: postId })];
            case 2:
                totalData = _d.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                res.json({
                    data: comments,
                    pagination: {
                        currentPage: page,
                        dataPerPage: limit,
                        totalPages: totalPages,
                        totalData: totalData,
                        hasNextPage: Number(page) < totalPages,
                    },
                    links: {
                        previous: Number(page) > 1
                            ? "/comments/post/".concat(postId, "?page=").concat(Number(page) - 1, "&limit=").concat(limit)
                            : null,
                        next: Number(page) < totalPages
                            ? "/comments/post/".concat(postId, "?page=").concat(Number(page) + 1, "&limit=").concat(limit)
                            : null,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _d.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_2) });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getPostComments = getPostComments;
var getComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, comment, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                commentId = req.params.commentId;
                return [4 /*yield*/, Comment_1.default.findById(commentId).populate("userId", "username email profilePict")];
            case 1:
                comment = _a.sent();
                res.json(comment);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_3) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getComment = getComment;
var getReplies = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, _a, _b, page, _c, limit, skip, comments, totalData, totalPages, error_4, error_5;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 6, , 7]);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, , 5]);
                commentId = req.params.commentId;
                _a = req.query, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? "20" : _c;
                skip = (Number(page) - 1) * Number(limit);
                return [4 /*yield*/, Comment_1.default.find({ parentId: commentId })
                        .limit(Number(limit))
                        .skip(skip)
                        .populate("userId", "username email profilePict")];
            case 2:
                comments = _d.sent();
                return [4 /*yield*/, Comment_1.default.countDocuments({ parentId: commentId })];
            case 3:
                totalData = _d.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                res.json({
                    data: comments,
                    pagination: {
                        currentPage: page,
                        dataPerPage: limit,
                        totalPages: totalPages,
                        totalData: totalData,
                        hasNextPage: Number(page) < totalPages,
                    },
                    links: {
                        previous: Number(page) > 1
                            ? "/comments/replies/".concat(commentId, "?page=").concat(Number(page) - 1, "&limit=").concat(limit)
                            : null,
                        next: Number(page) < totalPages
                            ? "/comments/replies/".concat(commentId, "?page=").concat(Number(page) + 1, "&limit=").concat(limit)
                            : null,
                    },
                });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _d.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_4) });
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_5 = _d.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_5) });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getReplies = getReplies;
var updateComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, content, image, comment, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                commentId = req.params.commentId;
                content = req.body.content;
                image = req.file;
                return [4 /*yield*/, Comment_1.default.findById(commentId)];
            case 1:
                comment = _a.sent();
                if (!comment)
                    return [2 /*return*/, res.status(404).json({ message: "Comment not found" })];
                comment.content = content || comment.content;
                if (!image) return [3 /*break*/, 4];
                if (!comment.image) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, deleteFile_1.default)("images", comment.image)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                comment.image = image.filename;
                _a.label = 4;
            case 4: return [4 /*yield*/, comment.save()];
            case 5:
                _a.sent();
                res.status(201).json(comment);
                return [3 /*break*/, 7];
            case 6:
                error_6 = _a.sent();
                res.status(500).json({ messsage: (0, getErrorMessage_1.default)(error_6) });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updateComment = updateComment;
var deleteComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, comment, _a, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                commentId = req.params.commentId;
                return [4 /*yield*/, Comment_1.default.findById(commentId)];
            case 1:
                comment = _b.sent();
                if (!comment)
                    return [2 /*return*/, res.status(404).json({ message: "Comment not found" })];
                _a = comment.image;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, deleteFile_1.default)("image", comment.image)];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3:
                _a;
                return [4 /*yield*/, comment.deleteOne()];
            case 4:
                _b.sent();
                return [4 /*yield*/, Comment_1.default.deleteMany({ parentId: commentId })];
            case 5:
                _b.sent();
                return [4 /*yield*/, Post_1.default.findByIdAndUpdate({ _id: comment.postId }, { $inc: { commentsCount: -1 } })];
            case 6:
                _b.sent();
                res.json({ message: "Successfully deleted comment" });
                return [3 /*break*/, 8];
            case 7:
                error_7 = _b.sent();
                res.status(500).json({ messsage: (0, getErrorMessage_1.default)(error_7) });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.deleteComment = deleteComment;
var upvoteComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, commentId, comment, isUpvote, isDownvote, upvotedComment, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                _id = req.user._id;
                commentId = req.params.commentId;
                return [4 /*yield*/, Comment_1.default.findById(commentId)];
            case 1:
                comment = _a.sent();
                if (!comment)
                    return [2 /*return*/, res.status(404).json({ message: "Comment not found" })];
                isUpvote = comment === null || comment === void 0 ? void 0 : comment.upvotes.user.includes(_id);
                isDownvote = comment === null || comment === void 0 ? void 0 : comment.downvotes.user.includes(_id);
                upvotedComment = void 0;
                if (!!isUpvote) return [3 /*break*/, 3];
                return [4 /*yield*/, Comment_1.default.findByIdAndUpdate({ _id: commentId }, __assign({ $push: { "upvotes.user": _id }, $inc: { "upvotes.count": 1 } }, (isDownvote && { $pull: { "downvotes.user": _id }, $inc: { "downvotes.count": -1 } })))];
            case 2:
                upvotedComment = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, Comment_1.default.findByIdAndUpdate({ _id: commentId }, { $pull: { "upvotes.user": _id }, $inc: { "upvotes.count": -1 } })];
            case 4:
                upvotedComment = _a.sent();
                _a.label = 5;
            case 5:
                if (!upvotedComment || upvotedComment === null)
                    return [2 /*return*/];
                upvotedComment.upvotes.count = upvotedComment.upvotes.user.length;
                upvotedComment.downvotes.count = upvotedComment.downvotes.user.length;
                return [4 /*yield*/, upvotedComment.save()];
            case 6:
                _a.sent();
                res.json({
                    message: !isUpvote
                        ? "Successfully upvoted the comment with ID: ".concat(commentId)
                        : "Successfully removed your upvote from the comment with ID: ".concat(commentId),
                });
                return [3 /*break*/, 8];
            case 7:
                error_8 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_8) });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.upvoteComment = upvoteComment;
var downvoteComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, commentId, comment, isDownvote, isUpvote, downvotedComment, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                _id = req.user._id;
                commentId = req.params.commentId;
                return [4 /*yield*/, Comment_1.default.findById(commentId)];
            case 1:
                comment = _a.sent();
                if (!comment)
                    return [2 /*return*/, res.status(404).json({ message: "Comment not found" })];
                isDownvote = comment === null || comment === void 0 ? void 0 : comment.downvotes.user.includes(_id);
                isUpvote = comment === null || comment === void 0 ? void 0 : comment.upvotes.user.includes(_id);
                downvotedComment = void 0;
                if (!!isDownvote) return [3 /*break*/, 3];
                return [4 /*yield*/, Comment_1.default.findByIdAndUpdate({ _id: commentId }, __assign({ $push: { "downvotes.user": _id }, $inc: { "downvotes.count": 1 } }, (isUpvote && { $pull: { "upvotes.user": _id }, $inc: { "upvotes.count": -1 } })))];
            case 2:
                downvotedComment = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, Comment_1.default.findByIdAndUpdate({ _id: commentId }, { $pull: { "downvotes.user": _id }, $inc: { "downvotes.count": -1 } })];
            case 4:
                downvotedComment = _a.sent();
                _a.label = 5;
            case 5:
                if (!downvotedComment || downvotedComment === null)
                    return [2 /*return*/];
                downvotedComment.upvotes.count = downvotedComment.upvotes.user.length;
                downvotedComment.downvotes.count = downvotedComment.downvotes.user.length;
                return [4 /*yield*/, downvotedComment.save()];
            case 6:
                _a.sent();
                res.json({
                    message: !isDownvote
                        ? "Successfully downvoted the comment with ID: ".concat(commentId)
                        : "Successfully removed your downvote from the comment with ID: ".concat(commentId),
                });
                return [3 /*break*/, 8];
            case 7:
                error_9 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_9) });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.downvoteComment = downvoteComment;
//# sourceMappingURL=commentControllers.js.map