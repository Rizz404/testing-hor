"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.getFollowers = exports.getFollowings = exports.followUser = exports.updatePassword = exports.updateUserProfile = exports.getUserById = exports.getUsers = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
const mongoose_1 = require("mongoose");
const deleteFileFirebase_1 = __importDefault(require("../utils/deleteFileFirebase"));
const getUserProfile = async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User_1.default.findById(_id).select("-social");
        if (!user)
            return res.status(404).json({ message: `User with ${_id} not found!` });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getUserProfile = getUserProfile;
const getUsers = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const limit = 20;
        const skip = (Number(page) - 1) * limit;
        const totalData = await User_1.default.countDocuments();
        const users = await User_1.default.find().select("-social -password").limit(limit).skip(skip);
        // ! harus pakai ini karena biar hasil dibagi tidak jadi desimal
        const totalPages = Math.ceil(totalData / limit);
        res.json({
            data: users,
            pagination: {
                currentPage: page,
                dataPerPage: limit,
                totalPages,
                totalData,
                hasNextPage: Number(page) < totalPages,
            },
            links: {
                previous: Number(page) > 1 ? `/users?page=${Number(page) - 1}` : null,
                next: Number(page) < totalPages ? `/users?page=${Number(page) + 1}` : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User_1.default.findById(userId).select("-social -password");
        if (!user)
            return res.status(404).json({ message: `User with ${userId} not found!` });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getUserById = getUserById;
const updateUserProfile = async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User_1.default.findById(_id);
        if (!user)
            return res.status(404).json({ message: `User with ${_id} not found!` });
        const { username, email, fullname, phoneNumber, bio } = req.body;
        const profilePict = req.file;
        user.username = username || user.username;
        user.email = email || user.email;
        user.fullname = fullname || user.fullname;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.bio = bio || user.bio;
        if (profilePict) {
            if (user.profilePict) {
                (0, deleteFileFirebase_1.default)(user.profilePict);
            }
            // @ts-ignore
            user.profilePict = profilePict.fileUrl;
        }
        const updatedUser = await user.save();
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.updateUserProfile = updateUserProfile;
const updatePassword = async (req, res) => {
    try {
        const { _id } = req.user;
        const { currentPassword, newPassword } = req.body;
        const user = await User_1.default.findById(_id);
        if (!user?.password || user.isOauth === true) {
            return res.status(400).json({ message: "Oauth doesn't include password" });
        }
        const match = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!match) {
            return res.status(400).json({ message: "Password doesn't match" });
        }
        const salt = await bcrypt_1.default.genSalt();
        const hashedPassword = await bcrypt_1.default.hash(newPassword, salt);
        // * Tidak harus atomik karena kan password masing-masing user
        user.password = hashedPassword;
        await user.save();
        res.json({ message: "Update password suceess" });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.updatePassword = updatePassword;
const followUser = async (req, res) => {
    try {
        const { _id } = req.user;
        const { userId } = req.params;
        const user = await User_1.default.findById(_id);
        const userIdObjId = new mongoose_1.Types.ObjectId(userId);
        const isFollowed = user?.social.following.includes(userIdObjId);
        let followedUser;
        if (!isFollowed) {
            followedUser = await User_1.default.findByIdAndUpdate({ _id }, { $push: { "social.following": userIdObjId } }, { new: true });
            await User_1.default.findByIdAndUpdate({ _id: userIdObjId }, { $push: { "social.followers": _id } }, { new: true });
        }
        else {
            followedUser = await User_1.default.findByIdAndUpdate({ _id }, { $pull: { "social.following": userIdObjId } }, { new: true });
            await User_1.default.findByIdAndUpdate({ _id: userIdObjId }, { $pull: { "social.followers": _id } }, { new: true });
        }
        res.json(followedUser);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.followUser = followUser;
const getFollowings = async (req, res) => {
    try {
        const { _id } = req.user;
        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const user = await User_1.default.findById(_id).populate({
            path: "social.following",
            select: "-password -social",
            options: { limit: Number(limit), skip: Number(skip) },
        });
        const totalData = user?.social.following.length || 0;
        const totalPages = Math.ceil(totalData / Number(limit));
        res.json({
            data: user?.social.following,
            pagination: {
                currentPage: page,
                dataPerPage: limit,
                totalPages,
                totalData,
                hasNextPage: Number(page) < totalPages,
            },
            links: {
                previous: Number(page) > 1 ? `/users/following?page=${Number(page) - 1}` : null,
                next: Number(page) < totalPages ? `/users/following?page=${Number(page) + 1}` : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getFollowings = getFollowings;
const getFollowers = async (req, res) => {
    try {
        const { _id } = req.user;
        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const user = await User_1.default.findById(_id).populate({
            path: "social.followers",
            select: "-password -social",
            options: { limit: Number(limit), skip: Number(skip) },
        });
        const totalData = user?.social.followers.length || 0;
        const totalPages = Math.ceil(totalData / Number(limit));
        res.json({
            data: user?.social.followers,
            pagination: {
                currentPage: page,
                dataPerPage: limit,
                totalPages,
                totalData,
                hasNextPage: Number(page) < totalPages,
            },
            links: {
                previous: Number(page) > 1 ? `/users/followers?page=${Number(page) - 1}` : null,
                next: Number(page) < totalPages ? `/users/followers?page=${Number(page) + 1}` : null,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.getFollowers = getFollowers;
const searchUsers = async (req, res) => {
    try {
        const { username, email, page = "1" } = req.query;
        const limit = 10;
        const skip = (Number(page) - 1) * limit;
        // todo: Pelajari lagi tentang $option dan $regex
        let user;
        if (username) {
            user = await User_1.default.find({ username: { $regex: username, $options: "i" } })
                .select("_id username") // * Hanya menampilkan _id dan usernamenya
                .limit(limit)
                .skip(skip);
        }
        else if (email) {
            user = await User_1.default.find({ email: { $regex: email, $options: "i" } })
                .select("_id email") // * Hanya menampilkan _id dan emailnya
                .limit(limit)
                .skip(skip);
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.searchUsers = searchUsers;
//# sourceMappingURL=userControllers.js.map