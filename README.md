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

To keep this easy to manage and install, we use Docker Compose to launch both a
local development environment, and a live production environment. You'll have to
have both Docker and Docker Compose installed on your machine before you can run
either environment.

You can find instructions to install them here:
Docker:           https://docs.docker.com/get-docker/
Docker Compose:   https://docs.docker.com/compose/install/

## Microservices
For this website, we run 5 different microservices:

Proxy
- Reverse proxy to serve requests to the right services and hide the internal
  network.

Client
- Single Page Application style client built with a custom Javascript framework.
  This service serves all static files except 3D models.

Api
- Completely RESTful NodeJS API.

Storage
- Minio Object Storage to serve the 3D models publicly in a scalable way.
  Buckets are configured by the Api service.

Database
- MongoDB NoSQL database. Models and schemas are configured by the Api service.


For more information about the microservices' configurations, check the
`.yml` files for more documentation. For more information about the
microservices' file structure and design philosophy you can view the README
files in their individual directories.


## Docker Compose
All microservices are spawned with Docker Compose and managed in the
`docker-compose.yml` and `docker-compose.dev.yml` files for production and
development, respectively. To get you started, these are some of the basic
Docker Compose commands:


### Production environment
To run the environment (detached):

`docker-compose up -d --build`


To stop the environment:

`docker-compose down`

Access at:

`http://localhost:8001`


### Development environment
To rebuild all images and run the environment:

`docker-compose -f docker-compose.dev.yml up --build`


This is best to run undetached so that you have access to debug information. You
can stop this environment with Ctrl+C in a standard Linux terminal. After the
`up` command, you'll be able to access the application at `http://localhost` and
you can simply reload the page after you've saved changes to view them. There
will be no need to rebuild the containers until you restart them.


## Set up your local environment variables.
The server side of this service will require a few environment variables to be
set with local access credentials. You can set these settings in a `.env` file.
This file should be in your `.gitignore` because it should not end up in the
repository, because it contains things like database passwords. The service
expects the following environment variables:


### JSON Webtoken secret.
TOKEN_SECRET


### Database credentials.
DATABASE_USERNAME

DATABASE_PASSWORD


### Object storage credentials.
STORAGE_ACCESS_KEY

STORAGE_SECRET_KEY


## SSL
SSL is required to use the WebXR API, so keep that in mind when hosting this
application.
