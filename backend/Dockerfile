# Stage 1: Build the backend application
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production runtime environment
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy built assets and necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Expose the internal port (default to 3000)
EXPOSE 3000

# Set environment variables (can be overridden in docker-compose)
ENV NODE_ENV=production
ENV PORT=3000

# Command to run database migrations and start the application
CMD npx prisma db push && node dist/main
