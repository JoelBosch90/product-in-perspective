# The client was built with Node 16.
FROM node:16.3-alpine3.13

# Define a working directory for this image.
WORKDIR /client

# Give the node user control over the working directory.
RUN chown node /client && chgrp node /client

# We want to use the Node Package Manager to install our dependencies. These
# dependencies are listed in the package JSON files. We need them in our working
# directory.
COPY package*.json ./

# Indicate that we're in developer mode.
ENV NODE_ENV development

# We need to load some dependencies from repositories, so we'll need git.
RUN apk add git

# Let's not run these commands as the root user.
USER node

# For developer mode, we can use NPMs default install command.
RUN npm install

# Copy the application files to the directory.
COPY --chown=node:node . .

# We want to host the client at port 8000.
EXPOSE 8000

# Start the client in developer mode.
CMD ["npm", "run", "devStart"]