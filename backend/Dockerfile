FROM node:20-slim

# Install required packages and create non-root user
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl wget && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /app -s /sbin/nologin -c "Node.js user" nodejs

WORKDIR /app

# Copy and install dependencies (need devDeps for prisma generate)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy application code and build
COPY . .
RUN npx prisma generate && \
    npm prune --omit=dev && \
    npm cache clean --force && \
    chmod +x startup.sh worker-startup.sh && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["sh", "startup.sh"]
