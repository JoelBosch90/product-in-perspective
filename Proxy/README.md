# Proxy
The proxy for product in perspective is an Nginx reverse proxy setup. In this
directory, you'll find the configuration files for both the development and the
production environment.


They both provide redirects for /api to the Api service. For /models to the
models bucket of the Storage service. Only the development environment provides
a redirect for /minio to the Storage GUI. And both environments redirect all
other requests to the Client service.


This directory usually also contains the Nginx error logs.
