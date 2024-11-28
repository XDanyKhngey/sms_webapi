# School Management API

A RESTful API for a school management system, built with Express.js and MongoDB.

---

## Features

- User authentication with JWT
- MongoDB database integration
- Swagger API documentation
- Environment variable configuration via .env

---

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20 or later)
- [Docker](https://www.docker.com/) (optional for containerized deployment)

---

## Installation

1. Clone the repository:

   ```bash
   git clone this_repository_url
   cd sms_webapi
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and configure it as shown below:

   ```env
   PORT=3000
   STAGE=DEV # or PROD

   # DATABASE MONGODB
   DB_SERVER=localhost
   DB_NAME=school_db
   DB_USER=
   DB_PASS=

   # JWT
   JWT_SECRET=1efa81e3-4760-6610-9cf2-18daec8aef66
   JWT_EXPIRE=1h
   REFRESH_TOKEN_EXPIRED=48h
   ... (can find more in .env.example)
   ```

---

## Running the Application

### Development Mode

Run the application in development mode with live reload using nodemon:

```bash
npm run dev
```

This will also seed the database and generate Swagger documentation.

### Production Mode

Build and run the application for production:

```bash
npm start
```

---

## API Documentation

The API documentation is generated using Swagger and is accessible at:

```bash
http://localhost:3000/api-docs
```

---

## Using Docker

### Running with Docker Compose

1. Build and start the application:

   ```bash
   docker-compose up --build
   ```

2. Access the app at:

   ```bash
   http://localhost:3000
   ```

3. Stop the app:
   ```bash
   docker-compose down
   ```

---

## Deployment

To deploy the application, follow these steps:

1. Ensure your `.env` file is correctly configured for the production environment:

   ```env
   STAGE=PROD
   DB_SERVER=production_db_url
   DB_USER=your_prod_user
   DB_PASS=your_prod_password
   ```

2. Build and run the application with Docker for production:
   ```bash
   docker build -t school_api .
   docker run -d -p 3000:3000 --env-file .env school_api
   ```

---

## Scripts

### Available npm Scripts

| Script            | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm start`       | Starts the app in production mode                 |
| `npm run dev`     | Runs the app in development mode with live reload |
| `npm run swagger` | Generates Swagger documentation for the API       |

---

## Author

Dany Khgney  
Government Officer & Web Developer

---

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
