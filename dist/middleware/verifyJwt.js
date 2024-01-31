import jwt from "jsonwebtoken";
import User from "../models/User";
const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token)
            return res.status(401).json({ message: "No token included" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        if (!decoded.userId) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = await User.findById(decoded.userId).select("_id username email roles");
        next();
    }
    catch (error) {
        res.status(401).json(error);
    }
};
export default verifyJwt;
//# sourceMappingURL=verifyJwt.js.map