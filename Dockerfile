# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install curl for healthcheck support
RUN apk add --no-cache curl

# Install dependencies
COPY package*.json ./
RUN yarn install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "src/app.js"]
