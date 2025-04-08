# Stage 1: Install dependencies and build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
# Use npm ci for cleaner production installs
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
# Ensure prisma is available, might need to install it globally in this stage if not devDependency
# RUN npm install prisma --global # Optional: if prisma isn't in devDependencies
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the final production image
FROM node:18-alpine

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV production
# Optionally set PORT, Next.js defaults to 3000
# ENV PORT 3000

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public # Copy public folder if it exists

# Copy Prisma schema and generated client for runtime use
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
