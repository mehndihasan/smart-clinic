// import module
const express = require('express');
const config = require('./config');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth.route');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// connnect with database
const connectDatabase = require('./config/database');

// initialize the express app
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar{dispaly: none}',
    customSiteTitle: `${config.serviceName} API Docs`
}));

// use auth routes
app.use('/api/auth', authRoutes);

// 404 not found handler
app.use(notFoundHandler)

// global error handler
app.use(errorHandler);

// handle unhandled promise rejections
process.on('unhandledRejection', error => {
    logger.error(`Unhandled Promise Rejection: ${error.message}`);
    process.exit(1);
})

// handle uncaught exceptions
process.on('uncaughtException', error => {
    logger.error(`Uncaught Exeption: ${error.message}`);
    process.exit(1);
})

// start the server
const startServer = async () => {
    try {
        // connect to database
        await connectDatabase();

        // start listening
        const PORT = config.port;
        app.listen(PORT, () => {
            logger.info(`${config.serviceName} is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
}

startServer();