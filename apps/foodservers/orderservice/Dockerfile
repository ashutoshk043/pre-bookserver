# ------------------------------
# Stage 1 - Build
# ------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for dependency caching
COPY ../../package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY ../../ .

# ✅ Build only orderservice app (correct Nest build command)
RUN npm run build orderservice

# ------------------------------
# Stage 2 - Run
# ------------------------------
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy only built dist folder from builder stage
COPY --from=builder /usr/src/app/dist/apps/foodservers/orderservice ./dist

# Copy package files for runtime dependencies
COPY ../../package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy environment file (optional)
COPY ../../.env ./.env

# Set environment variable for port
ENV ORDERSERVICEPORT=9001

# Expose port (Docker doesn’t expand env vars automatically)
EXPOSE 9001

# ✅ Correct main entrypoint path
CMD ["node", "dist/main.js"]
