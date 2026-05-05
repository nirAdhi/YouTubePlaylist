FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN chmod +x startup.sh worker-startup.sh

EXPOSE 5000

CMD ["sh", "startup.sh"]
