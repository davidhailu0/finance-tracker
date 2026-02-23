# Stage 1: Build stage
FROM node:20-alpine AS builder
RUN npm install -g pnpm@10
WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY package.json pnpm-lock.yaml* ./
# Use --no-frozen-lockfile for Docker builds to handle lockfile mismatches
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the code and build
COPY . .
RUN pnpm run build

# Stage 2: Production stage
FROM node:20-alpine AS runner
RUN npm install -g pnpm@10

# Install netcat for database health check
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy sequelize-cli and migrations/seeders for database setup
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/seeders ./src/seeders
COPY --from=builder /app/.sequelizerc ./.sequelizerc
COPY --from=builder /app/src/config/config.js ./src/config/config.js

# Only copy what's needed to run the app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "start"]
