# Auth Service

This service is designed to be used as a standalone auth microservice behind an API Gateway or consumed by multiple backend services.

## Features

- User Registration
- User Login
- JWT-based authentication (access token + refresh token)
- Role-Based Access Control (RBAC)
- Password Hashing with bcrypt
- MongoDB database integration
- Input validation
- Centralized Error Handling
- Swagger UI API documentation
- Environment-based Configuration
- Clean Layered Architecture
- Request logging - Production-ready Logging (Winston)
- Graceful Error & Process Handling

## User Roles
- `patient` - Default role for patient
- `doctor` - Healthcare provider
- `clinician` - Clinical staff
- `admin` - System administrator

## User Schema

### Well Structure

This makes it robust persistence layer
- Schema-lever validation
- Password hashing hook
- Roles and Status enums
- Indexes
- `selective` fields
- JSON transformation
- `instance` methods

## Architecture Overview
```yaml
Client / API Gateway
        |
        v
   Auth Service
        |
   MongoDB (Users)

```
Other microservices do not access the database directly.
They only verify JWT tokens issued by this service.

## Project Structure
```bash
auth-service/
│
├── src/
│   ├── app.js                     # App bootstrap (entry point)
│
│   ├── config/                    # App & infra configuration
│   │   ├── index.js
│   │   ├── database.js
│   │   └── swagger.js
│
│   ├── routes/                    # Route definitions
│   │   └── auth.route.js
│
│   ├── controllers/               # HTTP layer
│   │   └── auth.controller.js
│
│   ├── services/                  # Business logic
│   │   └── auth.service.js
│
│   ├── models/                    # Database models
│   │   └── User.js
│
│   ├── middlewares/               # Express middlewares
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │   └── rbac.middleware.js
│   │   └── validator.middleware.js
│
│   ├── utils/                     # Reusable utilities
│   │   ├── errors.js
│   │   ├── logger.js
│   │   ├── jwt.js
│
├── .env
├── package.json
└── README.md

```

## Tech Stack
| Layer            | Technology |
| ---------------- | ---------- |
| Runtime          | Node.js    |
| Framework        | Express    |
| Database         | MongoDB    |
| Object Data Modeling (ODM) library              | Mongoose   |
| Auth             | JWT        |
| Password Hashing | bcrypt     |
| API Docs         | Swagger    |
| Logging          | Winston       |
| Config           | dotenv     |


## Prerequisites

- Node.js ≥ 18
- MongoDB (Local or Atlas)
- npm or yarn

## Dependency Installation

### Step 1: Install Core Runtime Dependencies
These packages are required for the application to run in production.

```bash
npm install express mongoose jsonwebtoken bcrypt dotenv cors
```
Purpose:
- `express` → Web framework
- `mongoose` → MongoDB ODM
- `jsonwebtoken` → Authentication using JWT
- `bcrypt` → Password hashing
- `dotenv` → Environment variable management
- `cors` → Enable cross-origin requests

### Step 2: Install API Documentation & Validation Dependencies
Used for API documentation, validation, and request handling.
```bash
npm install swagger-ui-express swagger-jsdoc express-validator
```
Purpose:
- `swagger-ui-express` → Swagger UI for API docs
- `swagger-jsdoc` → Swagger specification generator
- `express-validator` → Request validation middleware

### Step 3: Install Logging Dependencies
Used for application logging and monitoring.
```bash
npm install winston
```
Purpose:
- `winston` → Structured and configurable logging

### Step 4: Install Development Dependencies
Used only during development.
```bash
npm install -D nodemon
```
Purpose:
- `nodemon` → Auto-restarts server on file changes

### Step 5: Install Optional (Recommended) Security & Validation Dependencies
These are recommended for production-grade applications.
```bash
npm install joi express-rate-limit helmet
```
Purpose:
- `joi` → Schema-based validation
- `express-rate-limit` → Protect APIs from abuse
- `helmet` → Secure HTTP headers

## package.json Scripts (Example)
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "lint": "eslint src/",
    "test": "test",
    "seed": ""
  }
}
```

## Environment Variables
Create a .env file in the project root:

```env
PORT=3001
NODE_ENV=development
SERVICE_NAME=auth-service
MONGODB_URI=mongodb://localhost:27017/auth_db

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=yout-super-secret-refresh-jwt-key
JWT_REFRESH_EXPIRES_ID=7d
```

## Here's a recommended order for writing the code:
Follow a logical order that ensures dependencies are correctly managed and the application is built up from foundational components to higher-level features

### 1. Configuration and Utilities:

- Start with the configuration files in the `config` directory, such as `index.js`, `database.js`, and `swagger.js`. These files set up environment variables, database connections, and API documentation.
- Implement utility functions in the `utils` directory, such as `logger.js` and `jwt.js`, which provide reusable functionality across the application.

### 2. Models:
- Define the data `models` in the models directory, such as `User.js`. This establishes the schema and structure for data stored in the database.

### 3. Services:
- Develop the business logic in the `services` directory, like `auth.service.js`. Services handle the core functionality, such as user registration and authentication.

### 4. Middlewares:
- Write middleware functions in the `middlewares` directory, including `auth.middleware.js` and `error.middleware.js`. These handle request processing and error handling.

### 5. Controllers:
- Implement the controllers in the `controllers` directory, such as `auth.controller.js`. Controllers manage HTTP requests and responses, invoking services as needed.

### 6. Routes:
- Define the API routes in the `routes` directory, like `auth.route.js`. Routes map HTTP requests to controller actions.

### 7. Application Entry Point:
- Finally, set up the application entry point in `app.js`. This file initializes the Express application, sets up middleware, connects to the database, and starts the server.

By following this order, you ensure that foundational components are in place before building higher-level features, leading to a more organized and maintainable codebase.

## Running the Service
### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Swagger API Documentation
Once the service is running, open:
```bash
http://localhost:3001/api-docs
```

## API Endpoints
### Register User
`POST /api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login User
`POST /api/auth/login`

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```


## Logging (Winston)

- Centralized logger using Winston
- Supports multiple transports (console, file, external log systems)
- Used across controllers, services, and middlewares
- Logs:
    - Application startup
    - Errors & exceptions
    - Database connection status
    - Authentication events

## Security Notes
- Passwords are securely hashed using bcrypt
- JWT secrets are stored in environment variables
- Access tokens are short-lived
- Centralized error handling prevents sensitive data leaks

## Microservice Usage
- Auth service issues JWT tokens
- Other services validate JWT tokens locally
- No direct database access between services

## Future Enhancements
- Refresh token rotation
- OAuth (Google, GitHub, Azure AD)
- Role-Based Access Control (RBAC)
- Redis token blacklist
- Docker & Kubernetes deployment
- API Gateway integration

## Design Principles
- Separation of concerns
- Config-driven architecture
- Thin controllers, fat services
- Production-ready error handling
