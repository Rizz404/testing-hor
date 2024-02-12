"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
require("dotenv/config");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const tagRoutes_1 = __importDefault(require("./routes/tagRoutes"));
const path_1 = __importDefault(require("path"));
const getErrorMessage_1 = __importDefault(require("./utils/getErrorMessage"));
const allowedOrigins_1 = __importDefault(require("./config/allowedOrigins"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// * Middleware configuration
app.use(body_parser_1.default.json({ limit: "30mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "30mb", extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: allowedOrigins_1.default, credentials: true, optionsSuccessStatus: 200 }));
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" })); // ! buat image harus begini
// app.use(morgan("dev")); // ! netlify itu readonly jadi gabisa add log otomatis
// app.use(morgan("combined", { stream: logger }));
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "./public/assets")));
// * Routes
app.use("/auth", authRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/posts", postRoutes_1.default);
app.use("/comments", commentRoutes_1.default);
app.use("/tags", tagRoutes_1.default);
// * Add a simple view for root
app.get("/", async (req, res) => {
    try {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("Its working");
        res.end();
    }
    catch (error) {
        (0, getErrorMessage_1.default)(error);
    }
});
// * Server configuration
const NODE_ENV = process.env.NODE_ENV;
const DB_URI = process.env.DB_URI;
const DB_URI_LOCAL = process.env.DB_URI_LOCAL;
if (!NODE_ENV) {
    console.error("Error: NODE_ENV environment variable is not set");
    process.exit(1);
}
else if (!DB_URI) {
    console.error("Error: DB_URI environment variable is not set");
    process.exit(1);
}
else if (!DB_URI_LOCAL) {
    console.error("Error: DB_URI_LOCAL environment variable is not set");
    process.exit(1);
}
// * Server configuration
mongoose_1.default
    .connect(NODE_ENV !== "development" ? DB_URI : DB_URI_LOCAL)
    .then(() => app.listen(PORT, () => console.log(`Server run on port ${PORT}`)))
    .catch((error) => console.log(error));
exports.default = app;
//# sourceMappingURL=index.js.map