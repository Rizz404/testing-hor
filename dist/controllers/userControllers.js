"use strict";
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
exports.searchUsers = exports.getFollowers = exports.getFollowings = exports.followUser = exports.updatePassword = exports.updateUserProfile = exports.getUserById = exports.getUsers = exports.getUserProfile = void 0;
var User_1 = __importDefault(require("../models/User"));
var deleteFile_1 = __importDefault(require("../utils/deleteFile"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
var mongoose_1 = require("mongoose");
var getUserProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                _id = req.user._id;
                return [4 /*yield*/, User_1.default.findById(_id).select("-social")];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User with ".concat(_id, " not found!") })];
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_1) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserProfile = getUserProfile;
var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, skip, totalData, users, totalPages, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query.page, page = _a === void 0 ? 1 : _a;
                limit = 20;
                skip = (Number(page) - 1) * limit;
                return [4 /*yield*/, User_1.default.countDocuments()];
            case 1:
                totalData = _b.sent();
                return [4 /*yield*/, User_1.default.find().select("-social -password").limit(limit).skip(skip)];
            case 2:
                users = _b.sent();
                totalPages = Math.ceil(totalData / limit);
                res.json({
                    data: users,
                    pagination: {
                        currentPage: page,
                        dataPerPage: limit,
                        totalPages: totalPages,
                        totalData: totalData,
                        hasNextPage: Number(page) < totalPages,
                    },
                    links: {
                        previous: Number(page) > 1 ? "/users?page=".concat(Number(page) - 1) : null,
                        next: Number(page) < totalPages ? "/users?page=".concat(Number(page) + 1) : null,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_2) });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUsers = getUsers;
var getUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                return [4 /*yield*/, User_1.default.findById(userId).select("-social -password")];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User with ".concat(userId, " not found!") })];
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_3) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserById = getUserById;
var updateUserProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, user, _a, username, email, fullname, phoneNumber, bio, profilePict, updatedUser, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _id = req.user._id;
                return [4 /*yield*/, User_1.default.findById(_id)];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: "User with ".concat(_id, " not found!") })];
                _a = req.body, username = _a.username, email = _a.email, fullname = _a.fullname, phoneNumber = _a.phoneNumber, bio = _a.bio;
                profilePict = req.file;
                user.username = username || user.username;
                user.email = email || user.email;
                user.fullname = fullname || user.fullname;
                user.phoneNumber = phoneNumber || user.phoneNumber;
                user.bio = bio || user.bio;
                if (!profilePict) return [3 /*break*/, 4];
                if (!user.profilePict) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, deleteFile_1.default)("profilePict", user.profilePict)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                user.profilePict = profilePict.filename;
                _b.label = 4;
            case 4: return [4 /*yield*/, user.save()];
            case 5:
                updatedUser = _b.sent();
                res.json(updatedUser);
                return [3 /*break*/, 7];
            case 6:
                error_4 = _b.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_4) });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updateUserProfile = updateUserProfile;
var updatePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, _a, currentPassword, newPassword, user, match, salt, hashedPassword, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _id = req.user._id;
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                return [4 /*yield*/, User_1.default.findById(_id)];
            case 1:
                user = _b.sent();
                if (!(user === null || user === void 0 ? void 0 : user.password) || user.isOauth === true) {
                    return [2 /*return*/, res.status(400).json({ message: "Oauth doesn't include password" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(currentPassword, user.password)];
            case 2:
                match = _b.sent();
                if (!match) {
                    return [2 /*return*/, res.status(400).json({ message: "Password doesn't match" })];
                }
                return [4 /*yield*/, bcrypt_1.default.genSalt()];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, salt)];
            case 4:
                hashedPassword = _b.sent();
                // * Tidak harus atomik karena kan password masing-masing user
                user.password = hashedPassword;
                return [4 /*yield*/, user.save()];
            case 5:
                _b.sent();
                res.json({ message: "Update password suceess" });
                return [3 /*break*/, 7];
            case 6:
                error_5 = _b.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_5) });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updatePassword = updatePassword;
var followUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, userId, user, userIdObjId, isFollowed, followedUser, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                _id = req.user._id;
                userId = req.params.userId;
                return [4 /*yield*/, User_1.default.findById(_id)];
            case 1:
                user = _a.sent();
                userIdObjId = new mongoose_1.Types.ObjectId(userId);
                isFollowed = user === null || user === void 0 ? void 0 : user.social.following.includes(userIdObjId);
                followedUser = void 0;
                if (!!isFollowed) return [3 /*break*/, 4];
                return [4 /*yield*/, User_1.default.findByIdAndUpdate({ _id: _id }, { $push: { "social.following": userIdObjId } }, { new: true })];
            case 2:
                followedUser = _a.sent();
                return [4 /*yield*/, User_1.default.findByIdAndUpdate({ _id: userIdObjId }, { $push: { "social.followers": _id } }, { new: true })];
            case 3:
                _a.sent();
                return [3 /*break*/, 7];
            case 4: return [4 /*yield*/, User_1.default.findByIdAndUpdate({ _id: _id }, { $pull: { "social.following": userIdObjId } }, { new: true })];
            case 5:
                followedUser = _a.sent();
                return [4 /*yield*/, User_1.default.findByIdAndUpdate({ _id: userIdObjId }, { $pull: { "social.followers": _id } }, { new: true })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                res.json(followedUser);
                return [3 /*break*/, 9];
            case 8:
                error_6 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_6) });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.followUser = followUser;
var getFollowings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, _a, _b, page, _c, limit, skip, user, totalData, totalPages, error_7;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _id = req.user._id;
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c;
                skip = (Number(page) - 1) * Number(limit);
                return [4 /*yield*/, User_1.default.findById(_id).populate({
                        path: "social.following",
                        select: "-password -social",
                        options: { limit: Number(limit), skip: Number(skip) },
                    })];
            case 1:
                user = _d.sent();
                totalData = (user === null || user === void 0 ? void 0 : user.social.following.length) || 0;
                totalPages = Math.ceil(totalData / Number(limit));
                res.json({
                    data: user === null || user === void 0 ? void 0 : user.social.following,
                    pagination: {
                        currentPage: page,
                        dataPerPage: limit,
                        totalPages: totalPages,
                        totalData: totalData,
                        hasNextPage: Number(page) < totalPages,
                    },
                    links: {
                        previous: Number(page) > 1 ? "/users/following?page=".concat(Number(page) - 1) : null,
                        next: Number(page) < totalPages ? "/users/following?page=".concat(Number(page) + 1) : null,
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _d.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_7) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getFollowings = getFollowings;
var getFollowers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, _a, _b, page, _c, limit, skip, user, totalData, totalPages, error_8;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _id = req.user._id;
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c;
                skip = (Number(page) - 1) * Number(limit);
                return [4 /*yield*/, User_1.default.findById(_id).populate({
                        path: "social.followers",
                        select: "-password -social",
                        options: { limit: Number(limit), skip: Number(skip) },
                    })];
            case 1:
                user = _d.sent();
                totalData = (user === null || user === void 0 ? void 0 : user.social.followers.length) || 0;
                totalPages = Math.ceil(totalData / Number(limit));
                res.json({
                    data: user === null || user === void 0 ? void 0 : user.social.followers,
                    pagination: {
                        currentPage: page,
                        dataPerPage: limit,
                        totalPages: totalPages,
                        totalData: totalData,
                        hasNextPage: Number(page) < totalPages,
                    },
                    links: {
                        previous: Number(page) > 1 ? "/users/followers?page=".concat(Number(page) - 1) : null,
                        next: Number(page) < totalPages ? "/users/followers?page=".concat(Number(page) + 1) : null,
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _d.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_8) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getFollowers = getFollowers;
var searchUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, _b, page, limit, skip, user, error_9;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.query, username = _a.username, email = _a.email, _b = _a.page, page = _b === void 0 ? "1" : _b;
                limit = 10;
                skip = (Number(page) - 1) * limit;
                user = void 0;
                if (!username) return [3 /*break*/, 2];
                return [4 /*yield*/, User_1.default.find({ username: { $regex: username, $options: "i" } })
                        .select("_id username") // * Hanya menampilkan _id dan usernamenya
                        .limit(limit)
                        .skip(skip)];
            case 1:
                user = _c.sent();
                return [3 /*break*/, 4];
            case 2:
                if (!email) return [3 /*break*/, 4];
                return [4 /*yield*/, User_1.default.find({ email: { $regex: email, $options: "i" } })
                        .select("_id email") // * Hanya menampilkan _id dan emailnya
                        .limit(limit)
                        .skip(skip)];
            case 3:
                user = _c.sent();
                _c.label = 4;
            case 4:
                res.json(user);
                return [3 /*break*/, 6];
            case 5:
                error_9 = _c.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_9) });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.searchUsers = searchUsers;
//# sourceMappingURL=userControllers.js.map