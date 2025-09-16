require("dotenv").config();
const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {
    const white_lists = ["/", "/register", "/login"];
    if (white_lists.includes(req.path)) {
        return next();
    }

    if (req?.headers?.authorization?.split(' ')?.[1]) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                email: decoded.email,
                name: decoded.name
            };
            console.log(">>>token: " + decoded);
            return next();
        } catch (error) {
            return res.status(401).json({ message: "Token: INVALID" });
        }
    }

    return res.status(401).json({ message: "Token: NOT FOUND" });
};

module.exports = auth;
