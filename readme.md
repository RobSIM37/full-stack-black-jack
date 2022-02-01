# Full-Stack Blackjack!

Full-Stack Blackjack is a Blackjack program that runs the game on the front end and stores a players "chip account" on the back end, hence, full stack.

## Running the server on localhost:

The file index.js in the server folder is set designed to run the back end server. It is designated as "main" in the package.json file. This should allow it to be run with the command "nodemon" on your terminal if you have Node JS installed.

```bash
"main": "server/index.js"
```

```bash
$ nodemon
```

## Three Required Features

So, there is a definitional question here: Is playing Blackjack one feature or can you count game actions (such as hitting, standing, doubling down, or splitting) as individual features? If I play it safe and say that playing the game is one feature, then the other two would be the ability to save your current chip total to an in game "account" and re-loading your chips from that account during future sessions.

## File Structure

The project is first divided into "client" and "server" folders, each containing the files for the front and back ends respectively. 

The client folder contains the only html document for the project, index.html, and this is the file to point your browser to. Additionally, this file contains the two css files, one to reset the defualt browser settings and the other to apply the projects style settings.

Subfolders to client are the resource folder (containing png files as well as archived js files for reference and testing) and the scripts folder. The scripts folder is divided into display and logic folders. The logic folder contains reusable code for the model and controller for the game of blackjack (as well as the save system "front end"). The display folder contains code for this implimentation of presenting blackjack.

The server folder contains the three js files that run the backend. index.js houses the endpoints and serves as the entrypoint for the backend. account-controller.js is the module that provides the callback functions for the express endpoints. data-controller.js is the module that houses the players accounts and chip totals, as well as providing for new account numbers, saving, and loading requests. If this back end data were to become more complex, replacing this file with a database connection would allow for better handling of that increased complexity without radically changing other code.