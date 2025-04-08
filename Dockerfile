# Stage 1: Install dependencies and build the application
FROM node:18-bullseye-slim AS builder

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies based on package-lock.json
COPY package*.json ./
# Use npm ci for cleaner production installs
RUN npm ci

# Copy Prisma schema and database
COPY prisma ./prisma/
RUN mkdir -p /data && touch /data/prod.db && chmod 666 /data/prod.db

# Generate Prisma Client
RUN npx prisma generate && \
    npx prisma migrate deploy

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the final production image
FROM node:18-bullseye-slim

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV production
# Optionally set PORT, Next.js defaults to 3000
# ENV PORT 3000

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
RUN mkdir -p ./public
COPY --from=builder /app/public/. ./public/ || true # Silently skip if public folder doesn't exist

# Copy Prisma schema and generated client for runtime use
COPY --from=builder /app/prisma ./prisma
RUN mkdir -p /data && touch /data/prod.db && chmod 666 /data/prod.db

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
