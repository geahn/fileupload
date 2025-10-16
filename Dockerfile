# Stage 1: Build the React frontend
# This stage installs all dependencies (including devDependencies) and builds the static assets.
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and install all dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Run the build script defined in package.json. This creates the 'dist' directory.
RUN npm run build


# Stage 2: Create the final, lean production image
# This stage starts from a fresh, small Node.js image
FROM node:20-alpine

WORKDIR /app

# Copy package.json again and install ONLY production dependencies
COPY package.json ./
RUN npm install --omit=dev --no-color

# Copy the pre-built frontend assets from the 'build' stage
COPY --from=build /app/dist ./dist

# Copy the production server script
COPY server.js .

# Expose the port that the server will listen on
EXPOSE 3001

# The command that will be executed when the container starts
CMD ["node", "server.js"]