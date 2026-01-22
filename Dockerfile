# ============================================
# Dockerfile for Strapi CMS (Development Mode)
# ============================================
# This Dockerfile runs Strapi in development mode
# with hot reload enabled
# ============================================

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY package.json ./

# Install dependencies
# Use npm install since package-lock.json doesn't exist
RUN npm install

# Copy source code
COPY . .

# Expose Strapi port
EXPOSE 1337

# Set environment variables
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=1337

# Start Strapi in development mode
CMD ["npm", "run", "develop"]
