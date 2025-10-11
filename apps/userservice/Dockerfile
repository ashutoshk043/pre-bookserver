# Stage 1 - Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package files
COPY ../../package*.json ./
RUN npm install

# Copy all source files
COPY ../../ .

# Build only userservice app
RUN npm run build userservice

# Stage 2 - Run
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist/apps/userservice ./dist

# Copy package files for dependencies
COPY ../../package*.json ./
RUN npm install --omit=dev

# Copy environment file (optional)
COPY ../../.env ./.env

# Set environment variable for UserService
ENV USERSERVICEPORT=9003

# Expose port (Docker doesn’t expand ENV variables dynamically)
EXPOSE 9003

# Run the UserService
CMD ["node", "dist/main.js"]
