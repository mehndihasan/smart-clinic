require('dotenv').config();

module.exports = {
    // Server
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    serviceName: process.env.SERVICE_NAME || 'auth-service',

    // MongoDB
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_service_db',

    // JWT
    jwtSecret: process.env.JWT_SECRE || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'yout-super-secret-refresh-jwt-key',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    // Security


    // Logging
    logLevel: process.env.LOG_LEVEL || 'info'
}