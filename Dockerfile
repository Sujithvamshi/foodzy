# Stage 1: Build the Vite React App
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the App using Node.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the built app from the previous stage
COPY --from=builder /app/dist /app

# Expose only port 3000
EXPOSE 3000

# Serve the app on port 3000
CMD ["vite","preview","--port", "3000"]