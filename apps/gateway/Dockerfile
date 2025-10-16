# Stage 1 - Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build gateway

# Stage 2 - Run
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 8080
ENV GATEWAY_PORT=8080

CMD ["node", "dist/apps/gateway/main.js"]
