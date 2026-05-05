FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN chmod +x startup.sh worker-startup.sh

EXPOSE 5000

CMD ["sh", "startup.sh"]
