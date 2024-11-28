# Use the official Node.js 22-alpine image as the base image
FROM node:22-alpine

# Install Python, make, and g++ (dependencies for node-gyp)
RUN apk add --no-cache python3 make g++ bash

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (this ensures the right versions of dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy the .env file for environment variable configuration
COPY .env .env

# Expose the port the app will run on
EXPOSE ${PORT}

# Set the default command to start the app
CMD ["node", "index.js"]
