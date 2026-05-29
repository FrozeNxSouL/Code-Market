# Stage 1: Build the frontend application
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies with legacy peer deps if needed (Next.js 16/React 19 support)
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production runtime environment
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy built assets and necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Expose the internal port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Command to start the application
CMD ["npm", "run", "start"]
