'use strict';

//console.log(Date());
//console.log();
//console.log('Booting...');

const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);



var connectedSocket = null;
io.on('connection', function(socket) {
	if(!connectedSocket)
	{	
		print(`Someone is connected via Web-CLI. ID: ${socket.id}`);
		socket.emit('log', 'Connection Established');

		socket.on("login", onLogin)
		socket.on("data", onData)

		socket.on('disconnect', function(){authorized = false; connectedSocket = null; print(`Web-CLI user left. ID: ${socket.id}\n`);});
	}
	else
	{
		print(`Web-CLI is occupied. ${socket.id} is blocked.`);
		socket.emit('log', 'Connection is occupied. No access available.');
	}
	
	var authorized = false;
	var blocked = false;
	const allowedAttempts = 3;
	var attempts = 0;
	function onLogin(data) {
		if(blocked)
		{
			return;
		}
		else if(data === password)
		{
			authorized = true;
			connectedSocket = socket;
			print(`Web-CLI user has logged in. ID: ${socket.id}`);
			socket.emit("authorized");
		}
		else if(attempts >= allowedAttempts)
		{
			blocked = true;
			attempts = 0;
			setTimeout(async function(){blocked = false;}, 180000)
		}
		else
		{
			attempts++;
		}
	}

	function onData(data) {
		if(authorized && data)
		{
			const args = data.trim().split(/ +/g);
			const command = args.shift().toLowerCase();

			interpret(command, args);
		}	
	}
});

var interpret = function(){}

//System variables
var running = false;
var interpreterIsSet = false;

//Setting variables
var password = "admin";
var port = 80;

var logStatus = false;


//CLIENT SCRIPT FUNCTIONS
module.exports = {
	//Essential
	interpreter: function(interpreter) {
		if(running) {throw new Error("You can't set the interpreter after starting the Web-CLI.")}
		else if((typeof interpreter) !== "function") {throw new Error("Parameter must be of type: 'function'")}

		interpret = interpreter;
		interpreterIsSet = true;
	},
	start: function()
	{
		if(!interpreterIsSet) {throw new Error("You must set the 'interpreter' function first.\nUse 'interpreter()' to pass a function to be used as the interpreter")}

		app.use(express.static(__dirname + '/client'));
		server.listen(port);

		running = true;

		print(`Web-CLI running on port '${port}'.`);
	},

	//Settings
	setPassword: function(_password) {
		if(running) {throw new Error("You can't change the port after starting the Web-CLI.")}
		else if((typeof _password) !== "string") {throw new Error("Parameter must be of type: 'string'")}

		password = _password;
	},
	setPort: function(_port)
	{
		if(running) {throw new Error("You can't change the port after starting the Web-CLI.")}

		port = _port;
	},
	setLogStatus: function(set)
	{
		if((typeof set) !== "boolean") {throw new Error("Parameter must be of type: 'boolean'")}

		logStatus = true;
	},

	//Utility
	sendLog: function(data) {
		if(connectedSocket)
		{
			connectedSocket.emit("log", data);
		}
	}
};




//Internal functions
function print(msg)
{
	if(logStatus)
	{
		//let d = new Date();

		//console.log(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '| ' + msg);
		console.log(msg);
	}
}



//console.log('Booting complete');
//console.log(`Running the server on port ${port}...`);
//console.log('-------------------------------------\n');