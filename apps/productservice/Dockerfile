# Stage 1 - Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package files
COPY ../../package*.json ./
RUN npm install

# Copy all source files
COPY ../../ .

# Build only productservice app
RUN npm run build productservice

# Stage 2 - Run
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist/apps/productservice ./dist

# Copy package files for dependencies
COPY ../../package*.json ./
RUN npm install --omit=dev

# Copy environment file (optional)
COPY ../../.env ./.env

# Set environment variable for ProductService
ENV PRODUCTSERVICEPORT=9002

# Expose port (Docker doesn’t expand env vars)
EXPOSE 9002

# Run the ProductService
CMD ["node", "dist/main.js"]
