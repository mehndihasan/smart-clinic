const { AuthenticationError } = require("../utils/errors");
const { extractTokenFromHeader, verifyAccessToken } = require("../utils/jwt");


// Authentication middleware - verify JWT access token
const authenticate = (req, res, next) => {
    try {
        // Extract token from authorization header
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        if (!token) throw new AuthenticationError('No token provided');

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request object
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            roles: decoded.roles
        }

        next();
    } catch(error) {
        next(error);
    }
};

module.exports = {
    authenticate
}