
const jwt = require("jsonwebtoken");

function getCookie(req, name) {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
        return null;
    }

    const cookie = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));

    return cookie
        ? decodeURIComponent(cookie.slice(name.length + 1))
        : null;
}

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        let token = null;

        if (authHeader) {
            const parts = authHeader.split(" ");

            if (
                parts.length !== 2 ||
                parts[0] !== "Bearer" ||
                !parts[1]
            ) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid authorization format."
                });
            }

            token = parts[1];
        } else {
            // Fall back to the HttpOnly session cookie.
            token = getCookie(req, "cc_session");
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        };

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        return next();
    } catch (error) {
        console.warn("Authentication failed.");

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

module.exports = authenticate;
