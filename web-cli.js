'use strict';

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
		print(`Web-CLI user has connected. ID: ${socket.id} (IP: ${socket.handshake.address})`);
		socket.emit('log', 'Connection Established');

		socket.on("login", onEnter);
		socket.on("data", onData);
		socket.on("logout", onExit);


		socket.on('disconnect', function(){authorized = false; connectedSocket = null; print(`Web-CLI user has disconnected. ID: ${socket.id}\n`);});
	}
	else
	{
		print(`Web-CLI is occupied. ${socket.id} is blocked.`);
		socket.emit('log', 'Connection is occupied. No access available.');
	}
	
	var authorized = false;
	var blocked = false;
	
	var attempts = 0;
	function onEnter(data) {
		if(blocked) {
			return;
		} else if(data === password) {
			authorized = true;
			connectedSocket = socket;
			print(`Web-CLI user has logged in. ID: ${socket.id}`);
			socket.emit("authorized");
			onLogin();
		}	else if(attempts >= allowedAttempts) {
			blocked = true;
			attempts = 0;
			setTimeout(async function(){blocked = false;}, 180000);
		} else {
			attempts++;
		}
	}

	function onData(data) {
		if(authorized && data) {
			const message = new function(){
				this.content = data;
				this.respond = function(data){
				 	connectedSocket.emit("log", data);
				}
			}

			interpret(message);
		}	
	}

	function onExit(data) {
		if(authorized) {
			authorized = false;
			connectedSocket = null;
			socket.emit("log", "Logged Out");
			print(`Web-CLI user has logged out. ID: ${socket.id}`);
		}
	}
});

//Essentials
var interpret = function(){};

//Events
var onLogin = function(){};

//System variables
var running = false;
var interpreterIsSet = false;

//Setting variables
var password = "admin";
var port = 80;

var allowedAttempts = 3;
var logStatus = false;


//API FUNCTIONS
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

		print('Starting the Web-CLI...');

		app.use(express.static(__dirname + '/client'));
		server.listen(port);

		running = true;

		print(`Web-CLI running on port '${port}'.\n`);
	},

	//Settings
	setPassword: function(_password) {
		if(running) {throw new Error("You can't change the password after starting the Web-CLI.")}
		else if((typeof _password) !== "string") {throw new Error("Parameter must be of type: 'string'")}

		password = _password;
	},
	setPort: function(_port) {
		if(running) {throw new Error("You can't change the port after starting the Web-CLI.")}
		else if(!Number.isInteger(Number(_port))) {throw new Error("Parameter must be an integer.")}

		port = _port;
	},
	setAllowedAttempts: function(_allowedAttempts) {
		if(running) {throw new Error("You can't change the allowed attempts after starting the Web-CLI.")}
		else if((typeof _allowedAttempts) !== "number" || Number.isInteger(_allowedAttempts)) {throw new Error("Parameter must be of type 'number' and be an integer.")}
		
		allowedAttempts = _allowedAttempts;
	},
	setLogStatus: function(set)
	{
		if(running) {throw new Error("You can't change the log setting after starting the Web-CLI.")}
		else if((typeof set) !== "boolean") {throw new Error("Parameter must be of type: 'boolean'")}

		logStatus = set;
	},

	//Utility
	sendLog: function(data) {
		if(connectedSocket) {
			connectedSocket.emit("log", data);
		}
	},

	//Events
	onLogin: function(callback) {
		if(running) {throw new Error("You can't set an event after starting the Web-CLI.")}
		else if((typeof callback) !== "function") {throw new Error("Parameter must be of type: 'function'")}

		onLogin = callback;
	}
};




//Internal functions
function print(msg)
{
	if(logStatus)
	{
		let d = new Date();

		console.log(('0'+d.getHours()).slice(-2) + ':' + ('0'+d.getMinutes()).slice(-2) + ':' + ('0'+d.getSeconds()).slice(-2) + '| ' + msg);
	}
}