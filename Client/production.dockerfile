# The client was built with Node 16.
FROM node:16.3-alpine3.13

# Create the working directory and give it to the node user.
RUN mkdir -p /client && chown -R node:node /client

# Define a working directory for this image.
WORKDIR /client

# We want to use the Node Package Manager to install our dependencies. These
# dependencies are listed in the package JSON files. We need them in our working
# directory.
COPY --chown=node:node package*.json ./

# Indicate that we're in production mode.
ENV NODE_ENV production

# We need to load some dependencies from repositories, so we'll need git.
RUN apk add git

# Let's not run these commands as the root user.
USER node

# We want to install only the libraries that we need for production.
RUN npm ci --only=production

# Copy the application files to the directory.
COPY --chown=node:node . .

# We want to host the client at port 8000.
EXPOSE 8000

# Start the client in production mode.
CMD ["npm", "start"]