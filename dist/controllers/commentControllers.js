"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downvoteComment = exports.upvoteComment = exports.deleteComment = exports.updateComment = exports.getReplies = exports.getComment = exports.getPostComments = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
const deleteFile_1 = __importDefault(require("../utils/deleteFile"));
const getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
const createComment = async (req, res) => {
    try {
        const { _id } = req.user;
        const { parentId, postId } = req.params;
        const { content } = req.body;
        const image = req.file;
        const newComment = new Comment_1.default({
            ...(parentId && { parentId }),
            userId: _id,
            postId,
            content,
            // @ts-ignore
            ...(image && { image: image.fileUrl }),
        });
        const savedComment = await newComment.save();
        await Post_1.default.findByIdAndUpdate({ _id: postId }, { $inc: { commentsCount: 1 } });
        await Comment_1.default.findByIdAndUpdate({ _id: parentId }, { $inc: { repliesCounts: 1 } });
        res.json(savedComment);
    }
    catch (error) {
        res.status(400).json({ messsage: (0, getErrorMessage_1.default)(error) });
    }
};
exports.createComment = createComment;
const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const { page = "1", limit = "20" } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const comments = await Comment_1.default.find({ postId })
            .limit(Number(limit))
            .skip(skip)
            .populate("userId", "username email profilePict");
        const totalData = await Comment_1.default.countDocuments({ postId });
        const totalPages = Math.ceil(totalData / Number(limit));
        res.json({
            data: comments,
            pagination: {
                currentPage: page,
                dataPerPage: limit,
                totalPages,
                totalData,
                hasNextPage: Number(page) < totalPages,
            },
            links: {
                previous: Number(page) > 1
                    ? `/comments/post/${postId}?page=${Number(page) - 1}&limit=${limit}`
                    : null,
                next: Number(page) < totalPages
                    ? `/comments/post/${postId}?page=${Number(page) + 1}&limit=${limit}`
                    : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getPostComments = getPostComments;
const getComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment_1.default.findById(commentId).populate("userId", "username email profilePict");
        res.json(comment);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getComment = getComment;
const getReplies = async (req, res) => {
    try {
        try {
            const { commentId } = req.params;
            const { page = "1", limit = "20" } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const comments = await Comment_1.default.find({ parentId: commentId })
                .limit(Number(limit))
                .skip(skip)
                .populate("userId", "username email profilePict");
            const totalData = await Comment_1.default.countDocuments({ parentId: commentId });
            const totalPages = Math.ceil(totalData / Number(limit));
            res.json({
                data: comments,
                pagination: {
                    currentPage: page,
                    dataPerPage: limit,
                    totalPages,
                    totalData,
                    hasNextPage: Number(page) < totalPages,
                },
                links: {
                    previous: Number(page) > 1
                        ? `/comments/replies/${commentId}?page=${Number(page) - 1}&limit=${limit}`
                        : null,
                    next: Number(page) < totalPages
                        ? `/comments/replies/${commentId}?page=${Number(page) + 1}&limit=${limit}`
                        : null,
                },
            });
        }
        catch (error) {
            res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
        }
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getReplies = getReplies;
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const image = req.file;
        const comment = await Comment_1.default.findById(commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        comment.content = content || comment.content;
        if (image) {
            if (comment.image) {
                await (0, deleteFile_1.default)("images", comment.image);
            }
            comment.image = image.filename;
        }
        await comment.save();
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({ messsage: (0, getErrorMessage_1.default)(error) });
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment_1.default.findById(commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        comment.image && (await (0, deleteFile_1.default)("image", comment.image));
        await comment.deleteOne();
        await Comment_1.default.deleteMany({ parentId: commentId });
        await Post_1.default.findByIdAndUpdate({ _id: comment.postId }, { $inc: { commentsCount: -1 } });
        res.json({ message: "Successfully deleted comment" });
    }
    catch (error) {
        res.status(500).json({ messsage: (0, getErrorMessage_1.default)(error) });
    }
};
exports.deleteComment = deleteComment;
const upvoteComment = async (req, res) => {
    try {
        const { _id } = req.user;
        const { commentId } = req.params;
        const comment = await Comment_1.default.findById(commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        const isUpvote = comment?.upvotes.user.includes(_id);
        const isDownvote = comment?.downvotes.user.includes(_id);
        let upvotedComment;
        if (!isUpvote) {
            upvotedComment = await Comment_1.default.findByIdAndUpdate({ _id: commentId }, {
                $push: { "upvotes.user": _id },
                $inc: { "upvotes.count": 1 },
                ...(isDownvote && { $pull: { "downvotes.user": _id }, $inc: { "downvotes.count": -1 } }),
            });
        }
        else {
            upvotedComment = await Comment_1.default.findByIdAndUpdate({ _id: commentId }, { $pull: { "upvotes.user": _id }, $inc: { "upvotes.count": -1 } });
        }
        if (!upvotedComment || upvotedComment === null)
            return;
        upvotedComment.upvotes.count = upvotedComment.upvotes.user.length;
        upvotedComment.downvotes.count = upvotedComment.downvotes.user.length;
        await upvotedComment.save();
        res.json({
            message: !isUpvote
                ? `Successfully upvoted the comment with ID: ${commentId}`
                : `Successfully removed your upvote from the comment with ID: ${commentId}`,
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.upvoteComment = upvoteComment;
const downvoteComment = async (req, res) => {
    try {
        const { _id } = req.user;
        const { commentId } = req.params;
        const comment = await Comment_1.default.findById(commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        const isDownvote = comment?.downvotes.user.includes(_id);
        const isUpvote = comment?.upvotes.user.includes(_id);
        let downvotedComment;
        if (!isDownvote) {
            downvotedComment = await Comment_1.default.findByIdAndUpdate({ _id: commentId }, {
                $push: { "downvotes.user": _id },
                $inc: { "downvotes.count": 1 },
                ...(isUpvote && { $pull: { "upvotes.user": _id }, $inc: { "upvotes.count": -1 } }),
            });
        }
        else {
            downvotedComment = await Comment_1.default.findByIdAndUpdate({ _id: commentId }, { $pull: { "downvotes.user": _id }, $inc: { "downvotes.count": -1 } });
        }
        if (!downvotedComment || downvotedComment === null)
            return;
        downvotedComment.upvotes.count = downvotedComment.upvotes.user.length;
        downvotedComment.downvotes.count = downvotedComment.downvotes.user.length;
        await downvotedComment.save();
        res.json({
            message: !isDownvote
                ? `Successfully downvoted the comment with ID: ${commentId}`
                : `Successfully removed your downvote from the comment with ID: ${commentId}`,
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.downvoteComment = downvoteComment;
//# sourceMappingURL=commentControllers.js.map