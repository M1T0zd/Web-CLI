# zd-webcli
[![NPM](https://nodei.co/npm/zd-webcli.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/zd-webcli/) 
<br>
![dependencies](https://david-dm.org/M1T0zd/Web-CLI.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/M1T0zd/Web-CLI/issues)
[![HitCount](http://hits.dwyl.io/M1T0zd/Web-CLI.svg)](http://hits.dwyl.io/M1T0zd/Web-CLI)
<br>

This light-weight and simple (Node.js) application allows you to easily communicate with your server and send commands via the web.
It's made to be used on top of your own (Node.js) application, solely for communication and control purposes with that application.
It uses an `http` connection and presents you with a terminal-like web interface when you connect to it. You can then type in your commands and send it to the server. You could for example have it send you status reports back or execute certain practical functions within your application for administration.
<br><br><br>

## Usage
First you will have to make a `onData` callback function which will handle all incoming data from the web-CLI user(s). Then you have to configure the [settings](#settings), like setting a password. After everything is set you can use the `start()` function to start up the Web-CLI
<br><br>


### Example
```js
webcli = require("zd-webcli");

webcli.setPassword("SuperSecretPassword"); // Set the password.
webcli.setPort(8080); // Set the port.
webcli.onData(commandHandler); // 'commandHandler' is my own function. (See bottom)

webcli.start(); // Start! (Do after everything is set!)

// My 'onData' callback function
function commandHandler(user, data)
{
	// Parse the data to a format you like (if you want).
	const args = data.trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if(command === "say")
	{
		if(args) user.send(args[0]); // Send a message back to the client.
	}	
	else if(command === "help")
	{
		user.send("List of commands:\n" +
		"\tsay\n");
	}
	else
	{
		user.send("Invalid command. Try `help`.");
	}	
}
```

After running your application you can connect to the server it's running on with your browser. <br>
For example: `http://1.2.3.4:8080/`

See [Documentation](#Documentation)
<br><br><br>

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
<br><br><br>

## Documentation

### API
**\*=Essential**

* Main
	* [start()*](#start())
* Settings
	* [setPassword(password)*](#setPassword(password))
	* [setPort(port)](#setPort(port))
	* [setMaxAllowedAttempts(maxAllowedAttempts)](#setMaxAllowedAttempts(maxAllowedAttempts))
	* [setMaxAllowedUsers(maxAllowedUsers)](#setMaxAllowedUsers(maxAllowedUsers))
	* [setWhitelist(file)](#setWhitelist(file))
	* [setBlacklist(file)](#setBlacklist(file))
	* [setLogStatus(set)](#setLogStatus(set))
* Events
	* [onData(cb)*](#onData(cb))
	* [onLogin(cb)](#onLogin(cb))
	* [onLogout(cb)](#onLogout(cb))
* Utility
	* [broadcast(message)](#broadcast(message))
* Data
	* [connections](#connections)
	* [users](#users)


### Classes

* [Connection](#Connection)
* [User](#User)

<br>

<details>
<summary>API</summary>

**\*=Essential**

## --- Main ---

### start()*
Start the web-cli!
<br><br>


## --- Settings ---

### setPassword(password)*
Set the password.
| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | Password to be used. |
<br>

### setPort(port)
Set the port.  
**Default**: <code>80</code>  
| Param | Type | Description |
| --- | --- | --- |
| port | <code>number</code> \| <code>string</code> | Port to be used. |
<br>

### setMaxAllowedAttempts(maxAllowedAttempts)
Set the the max number of login attempts allowed by a connection before getting a timeout.
(0=unlimited)  
**Default**: <code>3</code>  
| Param | Type | Description |
| --- | --- | --- |
| maxAllowedAttempts | <code>number</code> \| <code>string</code> | Number of logins attempts allowed. |
<br>

### setMaxAllowedUsers(maxAllowedUsers)
Set the max number of concurrent users allowed.
(o=unlimited)  
**Default**: <code>1</code>  
| Param | Type | Description |
| --- | --- | --- |
| maxAllowedUsers | <code>number</code> \| <code>string</code> | Number of concurrent users allowed. |
<br>

### setWhitelist(file)
Set the path to a file containing IP addresses to be allowed exclusively.
(File path is relative to the application's entry point - file should be encoded in UTF-8 - Entries should be separated by lines.)  
| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | Path to file. |
<br>

### setBlacklist(file)
Set the path to a file containing IP addresses to be denied access invariably.
(File path is relative to the application's entry point - file should be encoded in UTF-8 - Entries should be separated by lines.)  
| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | Path to file. |
<br>

### setLogStatus(set)
Set if the Web-CLI will log to console.  
**Default**: <code>false</code>  
| Param | Type | Description |
| --- | --- | --- |
| set | <code>boolean</code> | Set logging. |
<br><br>


## --- Events ---

### onData(cb)*
Set the `onData` event's callback function.
| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | Callback function - takes user{[User](#User)} and data{string}. |
<br>

### onLogin(cb)
Set the `onLogin` event's callback function.  
| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | Callback function - takes user{[User](#User)}. |
<br>

### onLogout(cb)
Set the `onLogout` event's callback function.  
| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | Callback function - takes user{[User](#User)}. |
<br><br>


## --- Utility ---

### broadcast(message)
Broadcast a message to all current users.  
| Param | Type | Description |
| --- | --- | --- |
| message | <code>function</code> | Message to be sent. |
<br><br>


## --- Data ---

### connections
Array of all current [connections](#Connection).
<br>

### users
Array of all current [users](#User).

</details>

<br>

<details>
<summary>Classes</summary>

## Connection
Class representing a connection currently active.

### .id ⇒ <code>string</code>
Randomly generated ID of the connection.
 
### .ip ⇒ <code>string</code>
IP address of the connection.

### .disconnect()
Forcefully close the connection.
<br><hr>

## User
Class representing a user currently logged in.

### .id ⇒ <code>string</code>
Sequentially generated ID of the user.
  
### .connection ⇒ [<code>Connection</code>](#Connection)
Corresponding connection of the user.
  
### .logout()
Forcefully log the user out.
 
### .send(message)
Send the user a message.
| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Message to be sent. |


</details>
<br><br><br>

## Useful Info
- `clear` is a built in command in the interface. As it implies: it clears the terminal.
- `exit` and `logout` are built in commands in the interface. Use either to logout and exit the interface.
- The interface has a command history that can be navigated by using the up and down arrow keys in the input.
<br><br><br>

<hr>

[Trello Board](https://trello.com/b/uUeA1QBI/web-cli) &emsp; [NPM Package](https://www.npmjs.com/package/zd-webcli) &emsp; [GitHub Repository](https://github.com/M1T0zd/Web-CLI)