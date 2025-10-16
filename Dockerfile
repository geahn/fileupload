# =================================================================
# Stage 1: Build the React Frontend
# =================================================================
# This stage uses a full Node.js image to install all dependencies
# (including development ones) and create a production build of the React app.
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to leverage Docker's layer caching.
# This step only re-runs if package.json changes.
COPY package.json ./

# Install all dependencies, including devDependencies needed for the build
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Run the build script defined in package.json.
# This will compile the TypeScript/React code and create a static 'dist' folder.
RUN npm run build

# =================================================================
# Stage 2: Create the Final Production Image
# =================================================================
# This stage starts from a fresh, lightweight Node.js image.
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json again to install only production dependencies
COPY package.json ./

# Install ONLY the dependencies needed to run the server in production.
# --omit=dev skips devDependencies like Vite, TypeScript, etc.
RUN npm install --omit=dev --no-color

# Copy the pre-built frontend assets from the 'build' stage into our final image
COPY --from=build /app/dist ./dist

# Copy the production server script
COPY server.js .

# Expose port 3001 to the outside world. This must match the port in your server.js
# and your Easypanel configuration.
EXPOSE 3001

# The command that will be executed when the container starts.
# This runs your Express server.
CMD ["node", "server.js"]
