# Backend Node.js
FROM node:18-alpine as backend

# Set working directory
WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy backend source code
COPY backend/src ./src

# Set environment variables
ENV NODE_ENV=production

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "src/server.js"]