# manifest-starter-kit (v1)

Starter Kit for Manifest User Module (Node.js / Express web application).

Setup
----------
Install dependencies by using: **npm install**  
Install nodemon: **npm install -g nodemon**  
Install mocha: **npm install --g mocha**

Configuration
----------
Directory **config** contains global and sample configuration file. You should create
**config.development.js** and **config.production.js** files respectively using values for your environments.
By default the application is using Postgres as the database 

Running
----------
+ Run app with debug by using: **DEBUG=manifest-starter-kit:\* npm start**
+ Run app with debug and nodemon using: **DEBUG=manifest-starter-kit:\* nodemon ./bin/www**
+ Nodemon should also work this way: **nodemon**

Testing
----------
+ in the command line enter: **mocha**

Browser
----------
+ in the browser open the url: **http://localhost:3000/**

