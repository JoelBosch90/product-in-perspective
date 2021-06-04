# Product in perspective
Product in perspective is the result of a thesis project in 2021 to explore the
potential of augmented reality in reducing plastic consumption. Our current
scale of plastic consumption creates huge waste problems and is one of the main
polutants on our planet, but those consequences seem far removed when you're
buying food in the supermarket. The idea is that we can use augmented reality
to help visualize those consequences to help create consumer awareness.

Product in perspective is a website that lets a user scan a product and then
shows 3D models to represent that product in an augmented reality scene. You can
use this to show representations of plastic consumption after scanning plastic
packaging. But you might notice that nothing about this app is inherently about
plastic consumption. This is done intentionally, to open it up to other
potential uses.

The website revolves around two different interfaces: a consumer facing
interface that lets the user scan a product and then shows a 3D representation,
and an admin interface that lets a user create new instances of the consumer
facing interface at a new URL, with new products, models and texts.

## Requirements
The entire website consists of various seperate microservices that all work
together. This gives the website the potential for separately scaling individual
microservices if traffic demands rise in the future. For now, it also helps keep
a clear separation of concerns.

To keep this easy to manage and install, we use both Docker, and Docker Compose
to launch both a local development environment, and a live production
environment. You'll have to have both Docker and Docker Compose installed on
your machine before you can run either environment.

You can find instructions to install them here:
Docker:           https://docs.docker.com/get-docker/
Docker Compose:   https://docs.docker.com/compose/install/

## Microservices
For this website, we run 4 different microservices. The Client to serve general
static files, the Storage to store 3D models, the Database to store all other
data, and the Api that offers a RESTful API. We don't want to serve the models
with the other static files, as we need this part to be scalable, and we don't
want to serve the models from the database either, because we want them to be
publicly available. This is why we use a separate object storage.

### Client

### Storage
For the object storage, we run a default Minio docker image at the default Minio
port (9000) with the following command. Buckets and bucket policies are created
and configured through the API.
`docker run -d -v /data/storage:/data -p 9000:9000 minio/minio server /data`

### Database
For the database, we run a default MongoDB docker image at the default MongoDB
port (27017) with the following command. All models are configurated through the
API using the Mongoose library.
`docker run -d -p 27017:27017 -v dbdata:/data/db mongo:4.4`

### Api










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

## Client side config file.
Inside the `server/Client/source/javascript` directory (and the corresponding
`server/Client/public/javascript` directory), there should be a `config.js` file
that exports an object called `CONFIG`. This allows us to automatically access
different API endpoints depending on our environment. The `CONFIG` object should
have the following properties:
CONFIG.apiUrl   - String that describes the location of the API.

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
