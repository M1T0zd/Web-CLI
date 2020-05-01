# zd-webcli
[![NPM](https://nodei.co/npm/zd-webcli.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/zd-webcli/) 
<br>
![dependencies](https://david-dm.org/M1T0zd/Web-CLI.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)
[![HitCount](http://hits.dwyl.io/M1T0zd/Web-CLI.svg)](http://hits.dwyl.io/M1T0zd/Web-CLI)
<br><br>
This (Node.js) application allows you to easily communicate with your server and send commands via the web.
It's made to be used on top of your own (Node.js) application, solely for communication and control purposes with that application.
It uses an `http` connection and presents you with a terminal-like web interface when you connect to it. You can then type in your commands and send it to the server. In your application you will need to make a 'command handler' function to interpret your input and process it in any way you desire. You could for example have it send you status reports back or execute certain practical functions within your application.
<br><br>

## Usage
First you will have to make a function that wil be used as the interpreter. Then you need to set it all up, which means using the `interpreter()` function to pass on that function you made as a parameter to interpret the input from the client (the Web-CLI user). Also setting a unique password and port (see [settings](#settings)) might be preferable to really secure and customize your web-CLI connection.
After that is done, you're all set and ready to start! Use the `start()` function to start up the Web-CLI (do this after everything is fully set).
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

### Example
```js
webCLI = require("zd-webcli");

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

## The Interface
The interface can be used on a **mobile**, **tablet**, or **PC**, with the use of interactive web design. <br>
![Interactive interfaces](https://user-images.githubusercontent.com/34724179/80845634-177f4600-8c0a-11ea-9658-65df7400632d.png)
<br><br>

### Login
The login screen is simple. <br>
![Login](https://user-images.githubusercontent.com/34724179/80845664-38e03200-8c0a-11ea-881c-51ed25a04b51.png)
<br><br>

### Communication
In the input you can send commands and arguments that you have made yourself. <br>
<img src="https://user-images.githubusercontent.com/34724179/54859543-d7fbe000-4d0e-11e9-8973-e4b34274390b.png" width="50%"/>
<br><br>
From the server you can send responses back in any way you desire. <br>
<img src="https://user-images.githubusercontent.com/34724179/80843353-6aee9580-8c04-11ea-9cb0-a69b46bfb30a.png" width="50%">

<br>

## Useful Info
- `clear` is a built in command in the interface. As it implies: it clears the terminal.
- The interface has a command history that can be scrolled through by using the up and down arrow keys in the input.
- Control characters such as `\n` and `\t` can be sent to the client no problem using the `sendLog()` function.

<br><br><br><hr>

[Trello Board](https://trello.com/b/uUeA1QBI/web-cli) &emsp; [NPM Package](https://www.npmjs.com/package/zd-webcli) &emsp; [GitHub Repository](https://github.com/M1T0zd/Web-CLI)

