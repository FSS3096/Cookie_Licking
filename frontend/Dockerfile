# Frontend React
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/tsconfig.json .

# Build the app
RUN npm run build

# Serve with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/frontend/build /usr/share/nginx/html

# Copy nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose frontend port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]