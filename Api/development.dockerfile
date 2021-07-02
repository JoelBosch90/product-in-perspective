# The fbx2gltf library does not work in Alpine, so we use the default node
# image.
FROM node:16.3

# Create the working directory and give it to the node user.
RUN mkdir -p /api && chown -R node:node /api

# Define a working directory for this image.
WORKDIR /api

# We want to use the Node Package Manager to install our dependencies. These
# dependencies are listed in the package JSON files. We need them in our working
# directory.
COPY --chown=node:node package*.json ./

# Indicate that we're in developer mode.
ENV NODE_ENV development

# Let's not run these commands as the root user.
USER node

# For developer mode, we can use NPMs default install command.
RUN npm install

# Copy the application files to the directory.
COPY --chown=node:node . .

# Create a temporary directory for the storage.
RUN mkdir -p ./Storage/tmp/

# We want to host the API at port 3000.
EXPOSE 3000

# Start the API application.
CMD ["npm", "run", "devStart"]