# HireSmart – Job Listing & Application System
A robust Node.js-based backend system to manage job listings, applications, user roles (admin, employer, candidate), and background matching logic, built with Sequelize, PostgreSQL, Redis, and Docker.

# Features
- User authentication & authorization
- Employer-driven job posting
- Candidate application submissions
- Role-based access control (RBAC)
- Background job matching engine (skills, salary, location)
- Job post archiving & cleanup (via cron)
- Redis caching for recent jobs (5 min)
- Swagger API documentation
- Dockerized setup for local & production environments

# Technologies
- Node.js, Express
- PostgreSQL + Sequelize ORM
- Redis (caching)
- Docker / Docker Compose
- Swagger (API docs)
- Helmet, xss-clean (security)
- express-jwt, bcrypt, Joi

### Setup Instructions

1. Clone the repository with `https://github.com/fahimeshti/hiresmart-project.git`
2. cd hiresmart-backend
3. Copy configuration from `.env.example` to `.env`
4. docker compose up --build
5. Then open http://localhost:3000/v1/docs for Swagger API.

### Apply Migrations & Seeders
- `docker exec -it node_app npx sequelize-cli db:migrate`
- `docker exec -it node_app npx sequelize-cli db:seed:all`



## Design Decisions

### Modular Architecture
- Feature-based separation of controllers, services, models, and routes ensures scalability.
- Middleware-driven validation and role-based access improves maintainability.

### PostgreSQL + Sequelize
- Sequelize enables structured migration and model definition while keeping raw SQL capability.

### Background Processing
- Cron jobs using node-cron handle:
- Job matching (every 2 min)
- Job archiving (daily)
- Unverified user cleanup (weekly)

### Redis Caching
- Recent job listings are cached using Redis with a 5-minute TTL, reducing load on Postgres.

### Security
- JWT-based authentication
- Passwords hashed with bcrypt
- Rate-limiting on public endpoints
- helmet, xss-clean to mitigate common vulnerabilities

### Swagger Docs
- Partially documented using JSDoc-style Swagger annotations
- Accessible at `/v1/docs`

### Docker Setup
- Implemented Docker health checks for service readiness
- Added Docker Compose configuration for Node.js, PostgreSQL, and Redis


## Development Scripts
```
# Run app locally without Docker
yarn install
yarn dev

# Run migrations/seeds
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--db\
  |--config\        # Configuration for database
  |--migrations\    # Database migrations
  |--models\        # Database models
  |--seeders\       #
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--routes\         # Routes
 |--schedulers\     # Background schedulers
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\

**Job routes**:\
`POST /v1/jobs` - create a job\
`GET /v1/jobs` - get all jobs\
`PATCH /v1/jobs/:jobId` - update a job\
`DELETE /v1/jobs/:jobId` - delete a job\
`POST /v1/jobs/:jobId/apply` - apply to a job\
`GET /v1/jobs/:jobId/applications` - get job applications\
`GET /v1/jobs/:jobId/stats` - get job statistics (employer only)

**Employer routes**:\
`GET /v1/employer/jobs` - get self posted jobs\

**Metrics routes**:\
`GET /v1/metrics/jobs` - get jobs statistics\
`GET /v1/metrics/users` - get users statistics\
`GET /v1/metrics/applications` - get applications statistics


## Code Overview

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```javascript
const catchAsync = require('../utils/catchAsync');

const controller = catchAsync(async (req, res) => {
	// this error will be forwarded to the error handling middleware
	throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
	"code": 404,
	"message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (catchAsync will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```javascript
// user.controller.js
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getUser = catchAsync(async (req, res) => {
	const user = await userService.getUserById(req.params.userId);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	res.send({ user });
});
```

## Validation

Request data is validated using [Joi](https://hapi.dev/family/joi/). Check the [documentation](https://hapi.dev/family/joi/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post(
	'/register',
	validate(authValidation.register),
	authController.register
);
```

## Authentication

To require authentication for certain routes, you can use `jwt` function at `config` folder

```javascript
// app.js
const jwt = require('./config/jwt');

app.use(jwt());
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

## Authorization

The `auth` middleware is used to require certain rights/permissions to access a route.

```javascript
const express = require('express');
const { grantAccess } = require('../../middlewares/validateAccessControl');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
	.route('/')
	.get(
		grantAccess('readAny', 'user'),
		validate(userValidation.getUsers),
		userController.getUsers
	);
```

In the example above, an authenticated user can access this route only if that user has the `getUsers` permission.

The permissions are role-based. You can view the permissions/rights of each role in the `src/config/roles.js` file.

If the user making the request does not have the required permissions to access this route, a Forbidden (403) error is thrown.

## Logging

Import the logger from `src/utils/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger = require('<path to src>/utils/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

## Boilerplate credit

-   [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate)
