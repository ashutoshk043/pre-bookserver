# ------------------------------
# Stage 1 - Build
# ------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy root package files
COPY ../../package*.json ./
RUN npm install

# Copy all source code
COPY ../../ .

# Build the restraurent microservice
RUN npm run build restraurent

# ------------------------------
# Stage 2 - Run
# ------------------------------
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy only the built files of restraurent
COPY --from=builder /usr/src/app/dist/apps/foodservers/restraurent ./dist

# Copy package.json for dependencies
COPY ../../package*.json ./
RUN npm install --omit=dev

# Copy environment file
COPY ../../.env ./.env

# Set environment variable
ENV RESTRAURENTPORT=9004

# Expose restraurent port
EXPOSE 9004

# Start the restaurant service
CMD ["node", "dist/main.js"]
