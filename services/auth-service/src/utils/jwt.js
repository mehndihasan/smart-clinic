const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('./logger');

/**
 * Generate JWT access token
 * @param {Object} payload - The payload (userId, email, roles)
 * @returns {String} - JWT access token
 */
const generateAccessToken = payload => {
    const tokenPayload = {
        userId: payload.userId,
        email: payload.email,
        roles: payload.roles
    }

    return jwt.sign(tokenPayload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
        issuer: config.serviceName
    });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - The payload (userId)
 * @returns {String} - JWT refresh token
 */
generateRefreshToken = payload => {
    const tokenPaylod = {
        userId: payload.userId
    }

    return jwt.sign(tokenPaylod, config.jwtRefreshSecret, {
        expiresIn: config.jwtRefreshExpiresIn,
        issuer: config.serviceName
    });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @throws {Error} - If token is invalid
 * @returns {Object} - Decoded token payload
 */
const verifyAccessToken = token => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Access token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid access token')
        }
        throw error;
    }
}

/**
 * Verify JWT refresh token
 * @param {String} token - JWT refresh token to verify
 * @throws {Error} - If token is invalid
 * @returns {Object} - Decoded token payload
 */
const verifyRefreshToken = token => {
    try {
        return jwt.verify(token, config.jwtRefreshSecret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Refresh token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid refresh token');
        }
        throw error;
    }
}

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String || null} - Extracted token from header or null
 */
const extractTokenFromHeader = authHeader => {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

    return parts[1];
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    extractTokenFromHeader
}