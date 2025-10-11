# Stage 1 - Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package files
COPY ../../package*.json ./
RUN npm install

# Copy all source files
COPY ../../ .

# Build only orderservice app
RUN npm run build orderservice

# Stage 2 - Run
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built files
COPY --from=builder /usr/src/app/dist/apps/orderservice ./dist

# Copy package files
COPY ../../package*.json ./
RUN npm install --omit=dev

# Copy environment file (optional)
COPY ../../.env ./.env

# Set default port for OrderService
ENV ORDERSERVICEPORT=9001

# Expose the port (Docker doesn’t expand env vars)
EXPOSE 9001

# Run the service
CMD ["node", "dist/main.js"]
