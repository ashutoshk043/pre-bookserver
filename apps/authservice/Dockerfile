FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Dev mode with watch (bypass dist issues)
CMD ["npm", "run", "start:auth"]
