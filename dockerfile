
# Stage 1: Build the application
FROM node:20 AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies (for build and dev dependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Run TypeScript build (if you're using TypeScript)
RUN npm run build  # Make sure you have a build script in package.json

# Stage 2: Production image (cleaner and smaller image)
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port that your app runs on
EXPOSE 4000

# Define the command to run your application
CMD ["npm", "start"]
