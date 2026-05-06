FROM node:20-slim

# Install wget for healthcheck and create non-root user
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends wget && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /app -s /sbin/nologin -c "Node.js user" nodejs

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# Copy application code and build
COPY . .
RUN npm run build && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["npm", "start"]
