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
exports.logout = exports.loginWithGoogle = exports.login = exports.register = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var User_1 = __importDefault(require("../models/User"));
var getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
var uuid_1 = require("uuid");
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, existingUsername, existingEmail, salt, hashedPassword, newUser, savedUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                return [4 /*yield*/, User_1.default.findOne({ username: username })];
            case 1:
                existingUsername = _b.sent();
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 2:
                existingEmail = _b.sent();
                if (!(username || email) || !password) {
                    return [2 /*return*/, res.status(400).json({ message: "Missing required field!" })];
                }
                if (existingUsername)
                    return [2 /*return*/, res.status(400).json({ message: "Username already taken" })];
                if (existingEmail)
                    return [2 /*return*/, res.status(400).json({ message: "Email already in use" })];
                return [4 /*yield*/, bcrypt_1.default.genSalt()];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
            case 4:
                hashedPassword = _b.sent();
                newUser = new User_1.default({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    isOauth: false,
                });
                return [4 /*yield*/, newUser.save()];
            case 5:
                savedUser = _b.sent();
                res.json({ message: "User ".concat(savedUser.username, " has been created") });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_1) });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var generateTokenAndSetCookie = function (user, res) {
    var token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "", {
        expiresIn: "30d",
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // ! Membuat cookie bertahan 30 hari
    });
};
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, user, match, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                if (!(username || email) || !password) {
                    return [2 /*return*/, res.status(400).json({ message: "Some field need to be filled" })];
                }
                return [4 /*yield*/, User_1.default.findOne({ $or: [{ username: username }, { email: email }] })];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(401).json({ message: "User not found" })];
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                match = _b.sent();
                if (!match)
                    return [2 /*return*/, res.status(401).json({ message: "Password does not match" })];
                user.lastLogin = new Date();
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                generateTokenAndSetCookie(user, res);
                res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: user.roles,
                    isOauth: user.isOauth,
                    lastLogin: user.lastLogin,
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_2) });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var loginWithGoogle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, fullname, user, randomUsername, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, fullname = _a.fullname;
                return [4 /*yield*/, User_1.default.findOne({ email: email }).select("-__v -createdAt -updatedAt -password")];
            case 1:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 3];
                randomUsername = String(fullname).split(" ")[0] + (0, uuid_1.v4)();
                user = new User_1.default({
                    username: randomUsername,
                    email: email,
                    fullname: fullname,
                    isOauth: true,
                    lastLogin: new Date(),
                });
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                user.lastLogin = new Date();
                return [4 /*yield*/, user.save()];
            case 4:
                _b.sent();
                generateTokenAndSetCookie(user, res);
                res.json(user);
                return [3 /*break*/, 6];
            case 5:
                error_3 = _b.sent();
                res.status(500).json({ message: (0, getErrorMessage_1.default)(error_3) });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.loginWithGoogle = loginWithGoogle;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token;
    return __generator(this, function (_a) {
        try {
            token = req.cookies.jwt;
            if (!token)
                return [2 /*return*/, res.status(204).json({ message: "You already logout" })];
            res.cookie("jwt", "", {
                httpOnly: true,
                expires: new Date(0),
            });
            res.json({ message: "Logout successfully" });
        }
        catch (error) {
            res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
        }
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
//# sourceMappingURL=authControllers.js.map