# Api
The Api for Product in Perspective is a NodeJS Express server that configures
and connects to the Database and Storage services.

## Api initialization
In the root directory, you'll find the index.js file, which only reads
environment variables and initializes the Api class which is found in the
Api.js file. This is the root class for the Api. The connections and
configurations for the Database and the Storage services are found in
Database.js and Storage.js, respectively.

## Directory structure
### Database
This contains all subfiles for the Database class in the Database.js file. It
has the models and schemas that are used in the MongoDB database. It is set up
in such a way that you can add new models simply by creating a new model file in
the `models` subdirectory. This will be read by the Database class the next time
the Api service restarts (which happens automatically when saving a JavaScript
file while running a developer environment).

### endpoints
This contains all API endpoints that can be publicly called. It is set up in
such a way that you can add new endpoints simply by creating a new endpoint file
in this directory. This will be read by the Api class the next time the Api
service restarts (which happens automatically when saving a JavaScript file
while running a developer environment).

### Storage
This contains all subfiles for the Storage class in the Storage.js file.
Currently, it only features the `tmp` directory that is used for temporary file
storage for checking and converting 3D models that are uploaded before they are
move to the Storage service.

### tools
This is a directory that contains helper functions that are used throughout the
Api service.
