# Web-CLI
This (Node.js) application allows you to easily communicate with your server and send commands using your browser via the internet.
It's made to be used on top of your own (Node.js) application, solely for communication and control purposes with that application.
It uses an `http` connection and gives you a terminal-like web application when you connect to the server it's running on. You can then type in your commands and send it. In your application you will first need to set all the settings, like the password, and then you'll need to make a 'command handler' function to interpret your input and process it in any way you desire. You could for example have it send you status reports back or execute certain practical functions.
<br><br>

## Getting Started
First you will have to make a function that wil be used as the interpreter. Then you need to set it all up, which means using the `interpreter()` function and pass on that function you made as a parameter to interpret the input from the client (the Web-CLI user).
After that is done, you're all set! However, it might be very useful to use some of the 'settings' command to really secure and customize your web-CLI connection.
<br><br>

### Functions

##### Essential
* **interpreter(*function*);**    Pass the the function that handles (interprets) the input as a parameter.

##### Settings
* **setPassword(*string*);**    Set the password needed to login. ("admin" is the default pasword.)

##### Utility
* **sendLog(*string*);**        Send a message to the Web-CLI client.
<br>

#### Example
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
<br>

After running your application you can connect to the server it's running on with your browser on port `8082`. <br>
For example: `http://1.2.3.4:8082/`
