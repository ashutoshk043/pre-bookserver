# ------------------------------
# Stage 1 - Build
# ------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY ../../package*.json ./
RUN npm install

# Copy source code
COPY ../../ .

# Build productservice using correct Nest app name
RUN npm run build productservice

# ------------------------------
# Stage 2 - Run
# ------------------------------
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built files
COPY --from=builder /usr/src/app/dist/apps/foodservers/productservice ./dist

# Copy package.json
COPY ../../package*.json ./
RUN npm install --omit=dev

# Copy environment file
COPY ../../.env ./.env

# Set environment variable for ProductService
ENV PRODUCTSERVICEPORT=9002

# Expose port
EXPOSE 9002

# Run the app
CMD ["node", "dist/main.js"]
