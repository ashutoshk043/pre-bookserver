# ------------------------------
# Stage 1 - Build
# ------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for dependency caching
COPY package*.json ./

# Install dependencies (full, including dev deps for build)
RUN npm install

# Copy entire source code into container
COPY . .

# Build only the authservice app
RUN npm run build authservice


# ------------------------------
# Stage 2 - Run
# ------------------------------
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy only the built authservice dist folder
COPY --from=builder /usr/src/app/dist/apps/authservice ./dist

# Copy package files for runtime deps
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy env file (optional if you mount it from outside)
COPY .env ./.env

# Default environment variable
ENV AUTHSERVICEPORT=9000

# Expose container port
EXPOSE 9000

# Run compiled NestJS app
CMD ["node", "dist/main.js"]
