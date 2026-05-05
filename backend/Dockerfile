FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN chmod +x startup.sh worker-startup.sh

EXPOSE 5000

CMD ["sh", "startup.sh"]
