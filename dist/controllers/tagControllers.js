"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockTag = exports.followTag = exports.getPostsByTagName = exports.searchTagsByName = exports.getTag = exports.getTags = exports.createTag = void 0;
const Tag_1 = __importDefault(require("../models/Tag"));
const getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = require("mongoose");
const createTag = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name)
            return res.status(400).json({ message: "Some field need to be filled" });
        const newTag = new Tag_1.default({
            name,
            ...(description && { description }),
        });
        const savedTag = await newTag.save();
        res.json({ message: `Tag ${savedTag.name} has been created` });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.createTag = createTag;
const getTags = async (req, res) => {
    try {
        const { page = "1", limit = 20, category } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        let totalData;
        let totalPages;
        let tags;
        switch (category) {
            case "featured-tag":
                tags = await Tag_1.default.find().limit(10).sort({ postsCount: -1 }).select("name");
                totalData = await Tag_1.default.countDocuments();
                totalPages = Math.ceil(totalData / Number(limit));
                break;
            case "all":
                tags = await Tag_1.default.find().limit(Number(limit)).skip(skip);
                totalData = await Tag_1.default.countDocuments();
                totalPages = Math.ceil(totalData / Number(limit));
                break;
            default:
                tags = await Tag_1.default.find().limit(Number(limit)).skip(skip);
                totalData = await Tag_1.default.countDocuments();
                totalPages = Math.ceil(totalData / Number(limit));
                break;
        }
        res.json({
            data: tags,
            pagination: {
                currentPage: page,
                dataPerPage: limit,
                totalPages,
                totalData,
                hasNextPage: Number(page) < totalPages,
            },
            links: {
                previous: Number(page) > 1 ? `/tags?page=${Number(page) - 1}` : null,
                next: Number(page) < totalPages ? `/tags?page=${Number(page) + 1}` : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getTags = getTags;
const getTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const tag = await Tag_1.default.findById(tagId);
        res.json(tag);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getTag = getTag;
const searchTagsByName = async (req, res) => {
    try {
        const { name, page = "1" } = req.query;
        const limit = 10;
        const skip = (Number(page) - 1) * limit;
        const tag = await Tag_1.default.find({ name: { $regex: name, $options: "i" } })
            .limit(limit)
            .skip(skip)
            .select("name postsCount");
        if (tag.length === 0) {
            return res.status(404).json({ message: `No tag named ${name}` });
        }
        res.json(tag);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.searchTagsByName = searchTagsByName;
const getPostsByTagName = async (req, res) => {
    try {
        const { name } = req.params;
        const { page = "1", limit = "20" } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const tag = await Tag_1.default.findOne({ name }).populate({
            path: "posts",
            options: { limit: Number(limit), skip: Number(skip) },
        });
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        const totalData = tag?.posts.length;
        const totalPages = Math.ceil(totalData / Number(limit));
        res.json({
            data: tag.posts,
            pagination: {
                currentPage: page,
                dataPerPage: limit,
                totalPages,
                totalData,
                hasNextPage: Number(page) < totalPages,
            },
            links: {
                previous: Number(page) > 1 ? `/tags?page=${Number(page) - 1}` : null,
                next: Number(page) < totalPages ? `/tags?page=${Number(page) + 1}` : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getPostsByTagName = getPostsByTagName;
const followTag = async (req, res) => {
    try {
        const { _id } = req.user;
        const { tagId } = req.params;
        const tagIdObjId = new mongoose_1.Types.ObjectId(tagId);
        const user = await User_1.default.findById(_id);
        const isFollowed = user?.social.followedTags.includes(tagIdObjId);
        const isBlocked = user?.social.blockedTags.includes(tagIdObjId);
        let followedTag;
        if (!isFollowed) {
            followedTag = await User_1.default.findByIdAndUpdate({ _id }, {
                $push: { "social.followedTags": tagIdObjId },
                ...(isBlocked && { $pull: { "social.blockedTags": tagIdObjId } }),
            }, { new: true });
        }
        else {
            followedTag = await User_1.default.findByIdAndUpdate({ _id }, {
                $pull: { "social.followedTags": tagIdObjId },
            }, { new: true });
        }
        res.json(followedTag);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.followTag = followTag;
const blockTag = async (req, res) => {
    try {
        const { _id } = req.user;
        const { tagId } = req.params;
        const tagIdObjId = new mongoose_1.Types.ObjectId(tagId);
        const user = await User_1.default.findById(_id);
        const isBlocked = user?.social.blockedTags.includes(tagIdObjId);
        const isFollowed = user?.social.followedTags.includes(tagIdObjId);
        let blockedTag;
        if (!isBlocked) {
            blockedTag = await User_1.default.findByIdAndUpdate({ _id }, {
                $push: { "social.blockedTags": tagIdObjId },
                ...(isFollowed && { $pull: { "social.followedTags": tagIdObjId } }),
            }, { new: true });
        }
        else {
            blockedTag = await User_1.default.findByIdAndUpdate({ _id }, {
                $pull: { "social.blockedTags": tagIdObjId },
            }, { new: true });
        }
        res.json(blockedTag);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.blockTag = blockTag;
//# sourceMappingURL=tagControllers.js.map