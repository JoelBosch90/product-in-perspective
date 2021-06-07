# The client was built with Node 16.
FROM node:16-alpine

# Define a working directory for this image.
WORKDIR /client

# We want to use the Node Package Manager to install our dependencies. These
# dependencies are listed in the package JSON files. We need them in our working
# directory.
COPY package*.json ./

# Indicate that we're in developer mode.
ENV NODE_ENV development

# For developer mode, we can use NPMs default install command.
RUN npm install

# Let's not run these commands as the root user.
USER node

# Copy the application files to the directory.
COPY --chown=node:node . .

# We want to host the client at port 8000.
EXPOSE 8000

# Start the client in developer mode.
CMD ["npm", "run", "devStart"]