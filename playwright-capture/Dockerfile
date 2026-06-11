FROM mcr.microsoft.com/playwright:v1.54.1-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src

CMD ["npm", "run", "start"]
