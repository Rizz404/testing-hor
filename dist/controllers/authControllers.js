"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.loginWithGoogle = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const getErrorMessage_1 = __importDefault(require("../utils/getErrorMessage"));
const uuid_1 = require("uuid");
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUsername = await User_1.default.findOne({ username });
        const existingEmail = await User_1.default.findOne({ email });
        if (!(username || email) || !password) {
            return res.status(400).json({ message: "Missing required field!" });
        }
        if (existingUsername)
            return res.status(400).json({ message: "Username already taken" });
        if (existingEmail)
            return res.status(400).json({ message: "Email already in use" });
        const salt = await bcrypt_1.default.genSalt();
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const newUser = new User_1.default({
            username,
            email,
            password: hashedPassword,
            isOauth: false,
        });
        const savedUser = await newUser.save();
        res.json({ message: `User ${savedUser.username} has been created` });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.register = register;
const generateTokenAndSetCookie = (user, res) => {
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "", {
        expiresIn: "30d",
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // ! Membuat cookie bertahan 30 hari
    });
};
const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!(username || email) || !password) {
            return res.status(400).json({ message: "Some field need to be filled" });
        }
        const user = await User_1.default.findOne({ $or: [{ username }, { email }] });
        if (!user)
            return res.status(401).json({ message: "User not found" });
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: "Password does not match" });
        user.lastLogin = new Date();
        await user.save();
        generateTokenAndSetCookie(user, res);
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            isOauth: user.isOauth,
            lastLogin: user.lastLogin,
        });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.login = login;
const loginWithGoogle = async (req, res) => {
    try {
        const { email, fullname } = req.body;
        let user = await User_1.default.findOne({ email }).select("-__v -createdAt -updatedAt -password");
        if (!user) {
            const randomUsername = String(fullname).split(" ")[0] + (0, uuid_1.v4)();
            user = new User_1.default({
                username: randomUsername,
                email,
                fullname,
                isOauth: true,
                lastLogin: new Date(),
            });
            await user.save();
        }
        user.lastLogin = new Date();
        await user.save();
        generateTokenAndSetCookie(user, res);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.loginWithGoogle = loginWithGoogle;
const logout = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token)
            return res.status(204).json({ message: "You already logout" });
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.json({ message: "Logout successfully" });
    }
    catch (error) {
        res.status(500).json({ message: (0, getErrorMessage_1.default)(error) });
    }
};
exports.logout = logout;
//# sourceMappingURL=authControllers.js.map