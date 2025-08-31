const jwt = require('jsonwebtoken');

function requireRole(roles) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token" });

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }
            req.user = decoded;
            next();
        } catch {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
}

module.exports = requireRole
