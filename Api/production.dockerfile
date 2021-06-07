# The API was built with Node 16.
FROM node:16-alpine

# Define a working directory for this image.
WORKDIR /usr/src/api

# We want to use the Node Package Manager to install our dependencies. These
# dependencies are listed in the package JSON files. We need them in our working
# directory.
COPY package*.json ./

# For developer mode, we can use NPMs default install command.
RUN npm install

# Copy the application files to the directory.
COPY . .

# We want to host the API at port 3000.
EXPOSE 3000

# Start the API application.
CMD ["npm", "start"]