Treasury-Automator
===========

#### About
A small side-project module that allows for mass venmo charge issuances using an Excel sheet. Will eventually be incorporated into Treasury as an additional feature. 

#### Getting Started

* Install node using [Node Version Manager](https://github.com/creationix/nvm). I suggest using the cURL install script.
* Make sure you have MongoDB installed as well.  
* git clone this repo into your working directory  
* cd into the project directory
* You now must install the dependencies that are embedded within the project. Do so by typing
 `$ npm install`
 `$ bower install`
* Finally, make sure all build files are compiled. Do so by typing  
`$ grunt build`
 

#### Running the app locally
 1. Navigate to the project directory
 
 2. Spin up a mongoDB instance by typing

  `$ mongod --dbpath your_db_directory`
 3. Open new terminal window and type

  `$ node ./bin/www`
 4. The server is now running and listening on localhost:3000! A verification statement that the DB had successfully connected should be console logged at this point in time. 
