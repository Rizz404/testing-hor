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
exports.blockTag = exports.followTag = exports.getPostsByTagName = exports.searchTagsByName = exports.getTag = exports.getTags = exports.createTag = void 0;
var Tag_1 = __importDefault(require("../models/Tag"));
var getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
var User_1 = __importDefault(require("../models/User"));
var mongoose_1 = require("mongoose");
var createTag = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, newTag, savedTag, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name = _a.name, description = _a.description;
                if (!name)
                    return [2 /*return*/, res.status(400).json({ message: "Some field need to be filled" })];
                newTag = new Tag_1.default(__assign({ name: name }, (description && { description: description })));
                return [4 /*yield*/, newTag.save()];
            case 1:
                savedTag = _b.sent();
                res.json({ message: "Tag ".concat(savedTag.name, " has been created") });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_1) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createTag = createTag;
var getTags = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, category, skip, totalData, totalPages, tags, _d, error_2;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 11, , 12]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, category = _a.category;
                skip = (Number(page) - 1) * Number(limit);
                totalData = void 0;
                totalPages = void 0;
                tags = void 0;
                _d = category;
                switch (_d) {
                    case "featured-tag": return [3 /*break*/, 1];
                    case "all": return [3 /*break*/, 4];
                }
                return [3 /*break*/, 7];
            case 1: return [4 /*yield*/, Tag_1.default.find().limit(10).sort({ postsCount: -1 }).select("name")];
            case 2:
                tags = _e.sent();
                return [4 /*yield*/, Tag_1.default.countDocuments()];
            case 3:
                totalData = _e.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                return [3 /*break*/, 10];
            case 4: return [4 /*yield*/, Tag_1.default.find().limit(Number(limit)).skip(skip)];
            case 5:
                tags = _e.sent();
                return [4 /*yield*/, Tag_1.default.countDocuments()];
            case 6:
                totalData = _e.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                return [3 /*break*/, 10];
            case 7: return [4 /*yield*/, Tag_1.default.find().limit(Number(limit)).skip(skip)];
            case 8:
                tags = _e.sent();
                return [4 /*yield*/, Tag_1.default.countDocuments()];
            case 9:
                totalData = _e.sent();
                totalPages = Math.ceil(totalData / Number(limit));
                return [3 /*break*/, 10];
            case 10:
                res.json({
                    data: tags,
                    pagination: {
                        currentPage: page,
                        dataPerPage: limit,
                        totalPages: totalPages,
                        totalData: totalData,
                        hasNextPage: Number(page) < totalPages,
                    },
                    links: {
                        previous: Number(page) > 1 ? "/tags?page=".concat(Number(page) - 1) : null,
                        next: Number(page) < totalPages ? "/tags?page=".concat(Number(page) + 1) : null,
                    },
                });
                return [3 /*break*/, 12];
            case 11:
                error_2 = _e.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_2) });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.getTags = getTags;
var getTag = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tagId, tag, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tagId = req.params.tagId;
                return [4 /*yield*/, Tag_1.default.findById(tagId)];
            case 1:
                tag = _a.sent();
                res.json(tag);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_3) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTag = getTag;
var searchTagsByName = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, _b, page, limit, skip, tag, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.query, name = _a.name, _b = _a.page, page = _b === void 0 ? "1" : _b;
                limit = 10;
                skip = (Number(page) - 1) * limit;
                return [4 /*yield*/, Tag_1.default.find({ name: { $regex: name, $options: "i" } })
                        .limit(limit)
                        .skip(skip)
                        .select("name postsCount")];
            case 1:
                tag = _c.sent();
                if (tag.length === 0) {
                    return [2 /*return*/, res.status(404).json({ message: "No tag named ".concat(name) })];
                }
                res.json(tag);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _c.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_4) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.searchTagsByName = searchTagsByName;
var getPostsByTagName = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, _a, _b, page, _c, limit, skip, tag, totalData, totalPages, error_5;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                name = req.params.name;
                _a = req.query, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? "20" : _c;
                skip = (Number(page) - 1) * Number(limit);
                return [4 /*yield*/, Tag_1.default.findOne({ name: name }).populate({
                        path: "posts",
                        options: { limit: Number(limit), skip: Number(skip) },
                    })];
            case 1:
                tag = _d.sent();
                if (!tag) {
                    return [2 /*return*/, res.status(404).json({ message: "Tag not found" })];
                }
                totalData = tag === null || tag === void 0 ? void 0 : tag.posts.length;
                totalPages = Math.ceil(totalData / Number(limit));
                res.json({
                    data: tag.posts,
                    pagination: {
                        currentPage: page,
                        dataPerPage: limit,
                        totalPages: totalPages,
                        totalData: totalData,
                        hasNextPage: Number(page) < totalPages,
                    },
                    links: {
                        previous: Number(page) > 1 ? "/tags?page=".concat(Number(page) - 1) : null,
                        next: Number(page) < totalPages ? "/tags?page=".concat(Number(page) + 1) : null,
                    },
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _d.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_5) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPostsByTagName = getPostsByTagName;
var followTag = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, tagId, tagIdObjId, user, isFollowed, isBlocked, followedTag, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                _id = req.user._id;
                tagId = req.params.tagId;
                tagIdObjId = new mongoose_1.Types.ObjectId(tagId);
                return [4 /*yield*/, User_1.default.findById(_id)];
            case 1:
                user = _a.sent();
                isFollowed = user === null || user === void 0 ? void 0 : user.social.followedTags.includes(tagIdObjId);
                isBlocked = user === null || user === void 0 ? void 0 : user.social.blockedTags.includes(tagIdObjId);
                followedTag = void 0;
                if (!!isFollowed) return [3 /*break*/, 3];
                return [4 /*yield*/, User_1.default.findByIdAndUpdate({ _id: _id }, __assign({ $push: { "social.followedTags": tagIdObjId } }, (isBlocked && { $pull: { "social.blockedTags": tagIdObjId } })), { new: true })];
            case 2:
                followedTag = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, User_1.default.findByIdAndUpdate({ _id: _id }, {
                    $pull: { "social.followedTags": tagIdObjId },
                }, { new: true })];
            case 4:
                followedTag = _a.sent();
                _a.label = 5;
            case 5:
                res.json(followedTag);
                return [3 /*break*/, 7];
            case 6:
                error_6 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_6) });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.followTag = followTag;
var blockTag = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, tagId, tagIdObjId, user, isBlocked, isFollowed, blockedTag, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                _id = req.user._id;
                tagId = req.params.tagId;
                tagIdObjId = new mongoose_1.Types.ObjectId(tagId);
                return [4 /*yield*/, User_1.default.findById(_id)];
            case 1:
                user = _a.sent();
                isBlocked = user === null || user === void 0 ? void 0 : user.social.blockedTags.includes(tagIdObjId);
                isFollowed = user === null || user === void 0 ? void 0 : user.social.followedTags.includes(tagIdObjId);
                blockedTag = void 0;
                if (!!isBlocked) return [3 /*break*/, 3];
                return [4 /*yield*/, User_1.default.findByIdAndUpdate({ _id: _id }, __assign({ $push: { "social.blockedTags": tagIdObjId } }, (isFollowed && { $pull: { "social.followedTags": tagIdObjId } })), { new: true })];
            case 2:
                blockedTag = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, User_1.default.findByIdAndUpdate({ _id: _id }, {
                    $pull: { "social.blockedTags": tagIdObjId },
                }, { new: true })];
            case 4:
                blockedTag = _a.sent();
                _a.label = 5;
            case 5:
                res.json(blockedTag);
                return [3 /*break*/, 7];
            case 6:
                error_7 = _a.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_7) });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.blockTag = blockTag;
//# sourceMappingURL=tagControllers.js.map