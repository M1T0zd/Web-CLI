# Web-CLI
This (Node.js) application allows you to easily communicate with your server and send commands using your browser via the internet.
It's made to be used on top of your own (Node.js) application, solely for communication and control purposes with that application.
It uses an `http` connection and presents you with a terminal-like web interface when you connect to it. You can then type in your commands and send it to the server. In your application you will need to make a 'command handler' function to interpret your input and process it in any way you desire. You could for example have it send you status reports back or execute certain practical functions within your application.
<br><br>

## Getting Started
First you will have to make a function that wil be used as the interpreter. Then you need to set it all up, which means using the `interpreter()` function to pass on that function you made as a parameter to interpret the input from the client (the Web-CLI user).
After that is done, you're all set! However, it might be very useful to use some of the 'settings' commands to really secure and customize your web-CLI connection. At the very end (after everything is fully set) you should start the Web-CLI with the `start()` function.
<br><br>

### Functions

##### Essential
- **interpreter(*function*)**	&emsp; Pass the the function that handles (interprets) the input as a parameter.
- **start()**			&emsp; Start the Web-CLI! Use at the very end only. (After everything is set)

##### Settings
- **setPassword(*string*)**	&emsp; Set the password needed to login. (_Default: "admin"_)
- **setPort(*int*)**		&emsp; Set the port the Web-CLI will be running on. (_Default: "80"_)
- **setLogStatus(*bool*)**	&emsp; Set if the Web-CLI will send statuses in the console (`console.log()`). (_Default: false_)

##### Utility
- **sendLog(*string*)**		&emsp; Send a message to the Web-CLI client.
<br>

#### Example
```js
webCLI = require("webCLI");

webCLI.setPassword("SuperSecretPassword"); //Set the password.
webCLI.setPort(8080); //Set the port.

webCLI.interpreter(commandHandler); //'commandHandler' is my own function. (See bottom)

webCLI.start(); //Start! (Do at the very end!)

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

After running your application you can connect to the server it's running on with your browser. <br>
For example: `http://1.2.3.4:8080/`
