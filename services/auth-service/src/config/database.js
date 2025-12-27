const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

// Connect to MongoDB database
const connectDatabase = async () => {
    try {
        const mongodbUri = config.mongodbUri;

        await mongoose.connect(mongodbUri);
        // console.log('Connected to MongoDB database');
        logger.info('Connected to MongoDB database');
    } catch (error) {
        // console.log('Error connecting to MongoDB database:', error.message);
        logger.error('Error connecting to MongoDB database:', error);
        // IMPORTANT: allow winston to flush
        setTimeout(() => process.exit(1), 500);
    }
}

module.exports = connectDatabase;