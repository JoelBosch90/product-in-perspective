### Product in perspective

## Using the correct version of Node
Before you begin, make sure that you use the Node Package Manager (npm) uses
the correct version of Node. We're using version 16.0.0.
`nvm use 16`

## Building the app
After any change to the src folder, you can run the following command to
prepare the dist folder for hosting.
`npm run build`

## Local test server
When you want to run a local test server, run the following command. It will
tell you which URL to follow to view the result.
`npm start`

## Restart production server
We use PM2 to run the production server. You may want to restart it after
changing the server.js file.
`pm2 restart server`

## Restart production database
We use systemctl to run the production database.
`sudo systemctl restart mongod`

## Symlinks
Inside the `server/Client/public` folder, there should be symlinks to
`source/html`, `source/models`, and `source/images`. These are not in de git
repository because these symlinks depend on the folder structure of the local
machine. You should add them manually.

## Set up your local environment variable.
The server side of this service will require a few variables that likely depend
on local settings. You can set these settings in a .env file. This file should
be in your .gitignore because it should not end up in the repository, because it
contains things like database passwords. The service expects the following
environment variables:
CPORT   - The port that will serve the client.
CHOST   - The host that will serve the client.
APORT   - The port that will serve the API.
AHOST   - The host that will serve the API.
DIR     - A path to the project directory.
DBUSER  - The username for connecting to the database.
DBPW    - The password for connecting to the database.
DBNAME  - The name of the database.