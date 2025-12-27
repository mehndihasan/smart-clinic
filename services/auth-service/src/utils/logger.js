const winston = require('winston');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Ensure logs directory exists so File transports can write
const logsDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configure winston to use the defined colors
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
});

// Shared line formatter (keep files clean, no ANSI color codes)
const line = winston.format.printf((info) => {
    return `${info.timestamp} [${config.serviceName}] ${info.level}: ${info.message}`;
});

// Formats
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    line
);

const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    line
);

// Create logger instance
const logger = winston.createLogger({
    level: config.logLevel,
    levels: { // Define log levels
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    },
    format: fileFormat, // default for file transports
    transports: [
        // Write all logs to console
        // new winston.transport.Console(),

        // Write all logs with level 'error' to error.log file
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),

        // Write all logs to combined.log file
        new winston.transports.File({
            filename: 'logs/combined.log',
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log' })
    ]
});

// Write all logs to console if not production environment
if (config.nodeEnv !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

module.exports = logger;