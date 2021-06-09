# Client
The client for Product in Perspective is a Single Page Application (SPA) hosted
by a NodeJS Express server. It is built with a custom JavaScript framework.


The advantage of an SPA is that it does not need to fully reload the page every
time it navigates. Instead, this navigation is managed in JavaScript by the
Router class the View class, and the goTo function. Read the documentation of
these files to learn more.


## Client initialization
In the root directory, you'll find the index.js file, which only reads
environment variables and initializes the Client class which is found in the
Client.js file. This class contains all logic for the Node Express server.


## Directory structure
You'll find two main directories here:

public      - This is the directory that has all the static files that are
              served publicly so that they can be used client-side. As a
              developer, you normally shouldn't have to directly change these
              files.
source      - This is the directory that has all the source files that the
              developer can update. These should only be moved to the public
              directory with the `npm run build` command. This command will
              compile JavaScript with Babel, style with LESS and copy over any
              other static files.


Both of these main directories feature the same structure inside:


### html
Because this is a Single Page Application, there is only a single HTML file that
loads the javascript and styling.


### images
These are all static images we use in the application. 3D models should not be
stored here, they should be stored in Object Storage through the Api service.


### javascript
This directory contains the custom JavaScript framework.


#### components
These are the specific implementation of the widgets to show workable interfaces
on screen.


#### pages
The only page we have is the index page. This initializes the entire framework
by initializing the Menu, the Router and the View widgets:

- The Menu makes sure it only shows on admin pages.
- The Router reads URL changes and installs the corresponding
  components in the View widget.
- The View widget makes sure that only one component is shown at
  a time and managed caching.


#### tools
These are the developer tools that can be used in widgets and components that do
not have any visual elements.


#### widgets
This is the meat of the framework. The widgets are the reusable parts that
govern most of the logic and the visual elements on the page.


### style
We use LESS as a precompiler. While this allows us to use specific LESS
functionality, I use it mostly to get a clearer file structure and nested CSS.
Except for that, you won't see much LESS specific styling, so if you know CSS
and understand nesting you can already read 99.9% of it.


#### components
This directory contains component-specific styling. There should not be much
here, usually it is preferable to add styling to elements or widgets. Generally,
the directories and files in this directory should follow the same structure as
their javascript equivalent.


#### elements
This directory contains all default styling for basic HTML components. The
styling here should be minimal and general. We shouldn't run into too many
situations where we have to override this styling or it will defeat the purpose.


#### properties
This directory is made to set the custom CSS variables that guarantee a
consistent look across the application. This goes for consistent use of fonts,
colours, sizes, spaces, and animations, to name the most frequent examples.


#### widgets
If we can get away with just styling default elements and not have any widget
specific styling, that is ideal. But that is often not the case. For those
cases, we can add additional styling here. Generally, the directories and files
in this directory should follow the same structure as their javascript
equivalent.
