# Frontend Dockerfile - React + Vite
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install and install optional rollup dependencies
RUN npm cache clean --force && \
    rm -rf node_modules && \
    npm install --include=optional

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine AS production

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
