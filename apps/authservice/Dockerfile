# Stage 1 - Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package files
COPY ../../package*.json ./
RUN npm install

# Copy all source files
COPY ../../ .

# Build only authservice app
RUN npm run build authservice

# Stage 2 - Run
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built files
COPY --from=builder /usr/src/app/dist/apps/authservice ./dist

# Copy package files
COPY ../../package*.json ./
RUN npm install --omit=dev

# Copy environment file (optional)
COPY ../../.env ./.env

# Set default port
ENV AUTHSERVICEPORT=9000

# Must expose a numeric value (Docker doesn’t expand vars here)
EXPOSE 9000

# Run the service
CMD ["node", "dist/main.js"]
