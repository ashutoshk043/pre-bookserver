# ------------------------------
# Stage 1 - Build
# ------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Build only authservice
RUN npm run build authservice


# ------------------------------
# Stage 2 - Run
# ------------------------------
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy full dist (important for paths)
COPY --from=builder /usr/src/app/dist ./dist

# Copy proto into dist (same relative structure)
COPY --from=builder /usr/src/app/apps/authservice/src/proto \
  ./dist/apps/authservice/src/proto

COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 9000 50051

CMD ["node", "dist/apps/authservice/main.js"]
