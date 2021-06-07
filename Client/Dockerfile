# The client was built with Node 16.
FROM node:16-alpine

# Define a working directory for this image.
WORKDIR /usr/src/client

# We want to use the Node Package Manager to install our dependencies. These
# dependencies are listed in the package JSON files. We need them in our working
# directory.
COPY package*.json ./

# For developer mode, we can use NPMs default install command.
RUN npm install

# Copy the application files to the directory.
COPY . .

# We need to make sure that the build is up to date.
RUN npm run build

# We want to host the client at port 8000.
EXPOSE 8000

# Start the API application.
CMD ["npm", "start"]