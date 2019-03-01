# Web-CLI

## Functions
* **setPassword();**    Set the password needed to login. ("admin" is the default pasword.)
* **interpreter();**    Pass the the function that handles the commands as a parameter.
* **sendLog();**        Send a message to the Web-CLI client.

### Example
```js
webCLI =  require("webCLI");

webCLI.setPassword("SuperSecretPassword");

webCLI.interpreter(commandHandler); //commandHandler is my own function. (See below)

//My 'interpreter' function
function commandHandler(command, args)
{
}

//...
```
