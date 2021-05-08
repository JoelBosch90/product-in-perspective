## Product in perspective

# Using the correct version of Node
Before you begin, make sure that you use the Node Package Manager (npm) uses
the correct version of Node. We're using version 16.0.0.
`nvm use 16`

# Building the app
After any change to the src folder, you can run the following command to
prepare the dist folder for hosting.
`npm run build`

# Local test server
When you want to run a local test server, run the following command. It will
tell you which URL to follow to view the result.
`npm start`

# Restart production server
We use PM2 to run the production server. You may want to restart it after
changing the server.js file.
`pm2 restart server`

# Symlinks
Inside the dist folder, there should be symlinks to `src/html`, `src/models`,
and `src/html`. These are not in de git repository because these symlinks
depends on the folder structure of the local machine. You should add them
manually.