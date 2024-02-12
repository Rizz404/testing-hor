"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.searchPostsByTitle = exports.savePost = exports.downvotePost = exports.upvotePost = exports.getPost = exports.getSelfPosts = exports.getSavedPosts = exports.getPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const User_1 = __importDefault(require("../models/User"));
const Tag_1 = __importDefault(require("../models/Tag"));
const mongoose_1 = require("mongoose");
const deleteFile_1 = __importDefault(require("../utils/deleteFile"));
const Comment_1 = __importDefault(require("../models/Comment"));
const getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
const createPost = async (req, res) => {
    try {
        const { _id } = req.user;
        const { title, tags, description } = req.body;
        const images = req.files;
        const newPost = new Post_1.default({
            userId: _id,
            title,
            tags,
            // @ts-ignore
            ...(images && images.length !== 0 && { images: images.map((image) => image.fileUrl) }),
            ...(description && { description }),
        });
        const savedPost = await newPost.save();
        tags.forEach(async (_id) => {
            await Tag_1.default.findByIdAndUpdate({ _id }, { $push: { posts: savedPost._id }, $inc: { postsCount: 1 } });
        });
        res.json(savedPost);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.createPost = createPost;
const getPosts = async (req, res) => {
    try {
        const { page = "1", limit = 20, category, userId } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        let posts;
        let totalData;
        let totalPages;
        switch (category) {
            case "home":
                // * Ambil semua posts untuk halaman home
                posts = await Post_1.default.find()
                    .select("-upvotes.user -downvotes.user")
                    .limit(Number(limit))
                    .skip(skip)
                    .populate("userId", "username email profilePict")
                    .populate("tags", "name");
                totalData = await Post_1.default.countDocuments();
                totalPages = Math.ceil(totalData / Number(limit));
                break;
            case "top":
                // * Ambil posts dengan upvotes terbanyak
                posts = await Post_1.default.find()
                    .select("-upvotes.user -downvotes.user")
                    .sort({ "upvotes.count": -1 })
                    .limit(Number(limit))
                    .skip(skip)
                    .populate("userId", "username email profilePict")
                    .populate("tags", "name");
                totalData = await Post_1.default.countDocuments();
                totalPages = Math.ceil(totalData / Number(limit));
                break;
            case "trending":
                // * Ambil posts berdasarkan kriteria trending, posts dengan komentar terbanyak
                posts = await Post_1.default.find()
                    .select("-upvotes.user -downvotes.user")
                    .sort({ commentsCount: -1 })
                    .limit(Number(limit))
                    .skip(skip)
                    .populate("userId", "username email profilePict")
                    .populate("tags", "name");
                totalData = await Post_1.default.countDocuments();
                totalPages = Math.ceil(totalData / Number(limit));
                break;
            case "fresh":
                // * Ambil posts terbaru
                posts = await Post_1.default.find()
                    .select("-upvotes.user -downvotes.user")
                    .sort({ createdAt: -1 })
                    .limit(Number(limit))
                    .skip(skip)
                    .populate("userId", "username email profilePict")
                    .populate("tags", "name");
                totalData = await Post_1.default.countDocuments();
                totalPages = Math.ceil(totalData / Number(limit));
                break;
            case "user":
                // * Ambil posts dari user tertentu
                posts = await Post_1.default.find({ userId })
                    .select("-upvotes.user -downvotes.user")
                    .limit(Number(limit))
                    .skip(skip)
                    .populate("userId", "username email profilePict")
                    .populate("tags", "name");
                totalData = await Post_1.default.countDocuments({ userId });
                totalPages = Math.ceil(totalData / Number(limit));
                break;
            default:
                return res.status(400).json({ message: "Invalid category" });
        }
        res.json({
            data: posts,
            category: category,
            pagination: {
                currentPage: page,
                dataPerPage: limit,
                totalPages,
                totalData,
                hasNextPage: Number(page) < totalPages,
            },
            links: {
                previous: Number(page) > 1
                    ? `/posts?category=${category}?page=${Number(page) - 1}&limit=${Number(limit)}`
                    : null,
                next: Number(page) < totalPages
                    ? `/posts?category=${category}?page=${Number(page) + 1}&limit=${Number(limit)}`
                    : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getPosts = getPosts;
const getSavedPosts = async (req, res) => {
    try {
        const { _id } = req.user;
        const { page = "1", limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const user = await User_1.default.findById(_id);
        const savedPost = user?.social.savedPosts;
        const posts = await Post_1.default.find({ _id: { $in: savedPost } })
            .limit(Number(limit))
            .skip(skip)
            .populate("userId", "username email profilePict")
            .populate("tags", "name");
        const totalData = savedPost?.length || 0;
        const totalPages = Math.ceil(totalData / Number(limit));
        res.json({
            data: posts,
            category: "saved",
            pagination: {
                currentPage: page,
                dataPerPage: limit,
                totalPages,
                totalData,
                hasNextPage: Number(page) < totalPages,
            },
            links: {
                previous: Number(page) > 1 ? `/posts/saved?page=${Number(page) - 1}&limit=${Number(limit)}` : null,
                next: Number(page) < totalPages
                    ? `/posts/saved?page=${Number(page) + 1}&limit=${Number(limit)}`
                    : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getSavedPosts = getSavedPosts;
const getSelfPosts = async (req, res) => {
    try {
        const { _id } = req.user;
        const { page = "1", limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const posts = await Post_1.default.find({ userId: _id })
            .limit(Number(limit))
            .skip(skip)
            .populate("userId", "username email profilePict")
            .populate("tags", "name");
        const totalData = await Post_1.default.countDocuments();
        const totalPages = Math.ceil(totalData / Number(limit));
        res.json({
            data: posts,
            category: "self",
            pagination: {
                currentPage: page,
                dataPerPage: limit,
                totalPages,
                totalData,
                hasNextPage: Number(page) < totalPages,
            },
            links: {
                previous: Number(page) > 1 ? `/posts/self?page=${Number(page) - 1}&limit=${Number(limit)}` : null,
                next: Number(page) < totalPages
                    ? `/posts/self?page=${Number(page) + 1}&limit=${Number(limit)}`
                    : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getSelfPosts = getSelfPosts;
const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post_1.default.findById(postId)
            .populate("userId", "username email profilePict")
            .populate("tags", "name");
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getPost = getPost;
const upvotePost = async (req, res) => {
    try {
        const { _id } = req.user;
        const { postId } = req.params;
        const post = await Post_1.default.findById(postId);
        if (!post)
            return res.status(404).json({ message: "Post not found" });
        const isUpvote = post?.upvotes.user.includes(_id);
        const isDownvote = post?.downvotes.user.includes(_id);
        let upvotedPost;
        if (!isUpvote) {
            upvotedPost = await Post_1.default.findByIdAndUpdate({ _id: postId }, {
                $push: { "upvotes.user": _id },
                $inc: { "upvotes.count": 1 },
                ...(isDownvote && { $pull: { "downvotes.user": _id }, $inc: { "downvotes.count": -1 } }),
            });
        }
        else {
            upvotedPost = await Post_1.default.findByIdAndUpdate({ _id: postId }, { $pull: { "upvotes.user": _id }, $inc: { "upvotes.count": -1 } });
        }
        if (!exports.upvotePost || upvotedPost === null)
            return;
        upvotedPost.upvotes.count = upvotedPost.upvotes.user.length;
        upvotedPost.downvotes.count = upvotedPost.downvotes.user.length;
        await upvotedPost.save();
        res.json({
            message: !isUpvote
                ? `Successfully upvoted the post with ID: ${postId}`
                : `Successfully removed your upvote from the post with ID: ${postId}`,
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.upvotePost = upvotePost;
const downvotePost = async (req, res) => {
    try {
        const { _id } = req.user;
        const { postId } = req.params;
        const post = await Post_1.default.findById(postId);
        if (!post)
            return res.status(404).json({ message: "Post not found" });
        const isDownvote = post?.downvotes.user.includes(_id);
        const isUpvote = post?.upvotes.user.includes(_id);
        let downvotedPost;
        if (!isDownvote) {
            downvotedPost = await Post_1.default.findByIdAndUpdate({ _id: postId }, {
                $push: { "downvotes.user": _id },
                $inc: { "downvotes.count": 1 },
                ...(isUpvote && { $pull: { "upvotes.user": _id }, $inc: { "upvotes.count": -1 } }),
            });
        }
        else {
            downvotedPost = await Post_1.default.findByIdAndUpdate({ _id: postId }, { $pull: { "downvotes.user": _id }, $inc: { "downvotes.count": -1 } });
        }
        if (!exports.upvotePost || downvotedPost === null)
            return;
        downvotedPost.upvotes.count = downvotedPost.upvotes.user.length;
        downvotedPost.downvotes.count = downvotedPost.downvotes.user.length;
        await downvotedPost.save();
        res.json({
            message: !isDownvote
                ? `Successfully downvoted the post with ID: ${postId}`
                : `Successfully removed your downvote from the post with ID: ${postId}`,
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.downvotePost = downvotePost;
const savePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { _id } = req.user;
        const postIdObjId = new mongoose_1.Types.ObjectId(postId);
        const user = await User_1.default.findById(_id);
        const isPostSaved = user?.social.savedPosts.includes(postIdObjId);
        let savedPost;
        if (!isPostSaved) {
            savedPost = await User_1.default.findByIdAndUpdate({ _id }, { $push: { "social.savedPosts": postIdObjId } });
        }
        else {
            savedPost = await User_1.default.findByIdAndUpdate({ _id }, { $pull: { "social.savedPosts": postIdObjId } });
        }
        res.json({
            message: !isPostSaved
                ? `Successfully saved post with Id ${postId}`
                : `Successfully unsaved post with Id ${postId}`,
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.savePost = savePost;
const searchPostsByTitle = async (req, res) => {
    try {
        // * kalau post tidak ada lebih baik mengembalikan array kosong dari pada 404
        const { title, page = "1" } = req.query;
        const limit = 10;
        const skip = (Number(page) - 1) * limit;
        const posts = title?.toString().trim() !== "" &&
            (await Post_1.default.find({ title: { $regex: title, $options: "i" } })
                .limit(limit)
                .skip(skip)
                .populate("userId", "username email profilePict")
                .populate("tags", "name"));
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.searchPostsByTitle = searchPostsByTitle;
const deletePost = async (req, res) => {
    try {
        const { _id } = req.user;
        const { postId } = req.params;
        const post = await Post_1.default.findOneAndDelete({ _id: postId, userId: _id });
        // * Sama kaya pake and seperti ini
        // const post = await Post.findOneAndDelete({ $and: [{ _id: postId }, { userId: _id }] });
        if (!post)
            return res.status(404).json({ message: "Post not found" });
        if (post.images && post.images.length <= 0) {
            post.images.forEach(async (image) => await (0, deleteFile_1.default)("images", image));
        }
        await Comment_1.default.deleteMany({ postId });
        await User_1.default.updateMany({ "social.savedPosts": postId }, { $pull: { "social.savedPosts": postId } });
        await Tag_1.default.updateMany({ posts: postId }, { $pull: { posts: postId } });
        res.json({ message: `Successfully deleted post with ID: ${post._id}` });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=postControllers.js.map