const { ConflictError, AuthenticationError, NotFoundError } = require('../utils/errors');
const {User, USER_ROLES, USER_STATUS} = require('./../models/User');
const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require('../utils/jwt');
const logger = require('../utils/logger');

/**
 * Register new user
 * @param {Object} userData - User data (email, password, firstName, lastName, roles)
 * @returns {Object} - registered user data and tokens
 */
const register = async userData => {
    const {email, password, firstName, lastName, roles} = userData;

    // check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        throw new ConflictError('User with this email already exists');
    }

    // set default roles of not provided
    const userRoles = roles && roles.length > 0 ? roles : [USER_ROLES.PATIENT];

    // create new user
    const user = new User({
        email: email.toLowerCase(),
        password,
        firstName,
        lastName,
        roles: userRoles,
        status: USER_STATUS.ACTIVE
    });

    // save the user
    await user.save();

    // generate token
    const userId = user._id.toString();

    const accessToken = generateAccessToken({
        userId,
        email: user.email,
        roles: user.roles
    });
    const refreshToken = generateRefreshToken({userId});

    // save refresh token to user document
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();

    await user.save({validateBeforeSave: false});

    logger.info(`New user registered: ${user.email}`);

    // return user data and token
    return {
        user: {
            userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,
            status: user.status
        },
        accessToken,
        refreshToken
    };
};

/**
 * Login user
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object} - User data and tokens
 */
const login = async (email, password) => {
    // find the user with password field
    const user = await User.findByEmail(email).select('+password');

    // if user does not exist
    if (!user) throw new AuthenticationError('Invalid email');

    // verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new AuthenticationError('Invalid password');

    // generate tokens
    const userId = user._id.toString();
    const accessToken = generateAccessToken({
        userId,
        email: user.email,
        roles: user.roles
    });
    const refreshToken = generateRefreshToken({userId});

    // update refresh token in db
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({validateBeforeSave: false});

    logger.info(`User logged in: ${user.email}`);

    // return user data and tokens
    return {
        user: {
            userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,
            status: user.status
        },
        accessToken,
        refreshToken
    }
};

/**
 * Access token user refresh token
 * @param {String} refreshToken - Refresh token
 * @returns {Object} - New access token
 */
const refreshToken = async refreshToken => {
    try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.userId).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) 
            throw new AuthenticationError('Invalid refresh token');

        if (user.status !== USER_STATUS.ACTIVE)
            throw new AuthenticationError('User is not active');

        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
            roles: user.roles
        });

        logger.info(`New access token generated for user: ${user.email}`);
        return {
            accessToken
        };
    } catch(error) {
        throw new AuthenticationError('Invalid or expired refresh token provided');
    }
};

/**
 * Logout user (invalidate refresh token)
 * @param {String} userId
 */
const logout = async userId => {
    const user = await User.findById(userId);

    if (!user) throw new NotFoundError('User not found');

    user.refreshToken = null;
    await user.save({validateBeforeSave: false});

    logger.info(`User logged out: ${user.email}`);
};

/**
 * Get user profile
 * @param {String} userId
 * @returns {Object} - User profile
 */
const getProfile = async userId => {
    const user = await User.findById(userId);
    
    if (!user) throw new NotFoundError('User not found');

    return {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        status: user.status,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
    };
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getProfile
};