# Web-CLI

## Functions
* **setPassword(*string*);**    Set the password needed to login. ("admin" is the default pasword.)
* **interpreter(*function*);**    Pass the the function that handles the commands as a parameter.
* **sendLog(*string*);**        Send a message to the Web-CLI client.

### Example
```js
webCLI = require("webCLI");

webCLI.setPassword("SuperSecretPassword"); //Set the password.

webCLI.interpreter(commandHandler); //'commandHandler' is my own function. (See below)

//My 'interpreter' function
function commandHandler(command, args) //Your function needs 2 parameters: command(string) and args(string[]).
{
	if(command === "say")
	{
		if(args) webCLI.sendLog(args[0]); //Send a message back to the client.
	}
	else
	{
		webCLI.sendLog("Sorry, I did not understand that command.");
	}
}
```

After running your application you can connect to the server it's running on with your browser on the port `8082`. <br>
For example `http://1.2.3.4:8082/`
