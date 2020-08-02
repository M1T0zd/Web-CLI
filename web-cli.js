'use strict';

const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);



var connectedSocket = null;
io.on('connection', function(socket) {
	if((settings.whitelist && !isWhitelisted(socket)) || isBlacklisted(socket)) {
		socket.emit('log', 'Connection Rejected');
		socket.disconnect(true);
		print(`Web-CLI user has been denied connection. ID: ${socket.id} (IP: ${socket.handshake.address})`)
	} else if(!connectedSocket) {	
		print(`Web-CLI user has connected. ID: ${socket.id} (IP: ${socket.handshake.address})`);
		socket.emit('log', 'Connection Established');

		socket.on("login", onEnter);
		socket.on("data", onData);
		socket.on("logout", onExit);


		socket.on('disconnect', function(){authorized = false; connectedSocket = null; print(`Web-CLI user has disconnected. ID: ${socket.id}\n`);});
	} else {
		print(`Web-CLI is occupied. ${socket.id} is blocked.`);
		socket.emit('log', 'Connection is occupied. No access available.');
	}
	
	var authorized = false;
	var blocked = false;
	
	var attempts = 0;
	function onEnter(data) {
		if(blocked) {
			return;
		} else if(data === settings.password) {
			authorized = true;
			connectedSocket = socket;
			socket.join("authorized"); // For sending global messages.
			print(`Web-CLI user has logged in. ID: ${socket.id}`);
			socket.emit("authorized");
			let user = new (require("./classes/user.js"))(socket);
			onLogin(user);
		} else if(attempts >= settings.allowedAttempts) {
			blocked = true;
			attempts = 0;
			setTimeout(async function(){blocked = false;}, 180000);
		} else {
			attempts++;
		}
	}

	function onData(data) {
		if(authorized && data) {
			let user = new (require("./classes/user.js"))(socket);
			interpret(user, data);
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
var settings = {};
settings.password = "admin";
settings.port = 80;

settings.allowedAttempts = 3;
settings.logStatus = false;


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
		server.listen(settings.port);

		running = true;

		print(`Web-CLI running on port '${settings.port}'.\n`);
	},

	//Settings
	setPassword: function(password) {
		if(running) {throw new Error("You can't change the password after starting the Web-CLI.")}
		else if((typeof password) !== "string") {throw new Error("Parameter must be of type: 'string'")}

		settings.password = password;
	},
	setPort: function(port) {
		if(running) {throw new Error("You can't change the port after starting the Web-CLI.")}
		else if(!Number.isInteger(Number(port))) {throw new Error("Parameter must be an integer.")}

		settings.port = port;
	},
	setAllowedAttempts: function(allowedAttempts) {
		if(running) {throw new Error("You can't change the allowed attempts after starting the Web-CLI.")}
		else if((typeof allowedAttempts) !== "number" || Number.isInteger(_allowedAttempts)) {throw new Error("Parameter must be of type 'number' and be an integer.")}
		
		settings.allowedAttempts = allowedAttempts;
	},
	setLogStatus: function(set)
	{
		if(running) {throw new Error("You can't change the log setting after starting the Web-CLI.")}
		else if((typeof set) !== "boolean") {throw new Error("Parameter must be of type: 'boolean'")}

		settings.logStatus = set;
	},
	setWhitelist: function(file)
	{
		if(running) {throw new Error("You can't set a whitelist after starting the Web-CLI.")}
		else if(settings.blacklist) {throw new Error("There has already been a blacklist set.")}
		else if((typeof file) !== "string") {throw new Error("Parameter must be of type: 'string'")}
		try {
			const fs = require('fs');
			const path = require("path");
			settings.whitelist = fs.readFileSync(path.resolve(path.dirname(process.mainModule.filename), file), "UTF-8").split('\n').filter(x => x);
		} catch (error) {
			console.log(error)
			if(error.code === "ENOENT") {throw new Error("Whitelist file could not be found.")}
			else{throw new Error("The whitelist file might be formatted incorrectly or there is another problem.")}
		}
	},
	setBlacklist: function(file)
	{
		if(running) {throw new Error("You can't set a blacklist after starting the Web-CLI.")}
		else if(settings.whitelist) {throw new Error("There has already been a whitelist set.")}
		else if((typeof file) !== "string") {throw new Error("Parameter must be of type: 'string'")}
		try {
			const fs = require('fs');
			const path = require("path");
			settings.blacklist = fs.readFileSync(path.resolve(path.dirname(process.mainModule.filename), file), "UTF-8").split('\n').filter(x => x);
		} catch (error) {
			if(error.code === "ENOENT") {throw new Error("Blacklist file could not be found.")}
			else{throw new Error(`The blacklist file might be formatted incorrectly or there is another problem.\nError: ${error}`)}
		}
	},

	//Utility
	// sendLog: function(data) {
	// 	if(connectedSocket) {
	// 		connectedSocket.emit("log", data);
	// 	}
	// },
	sendAll: function(data) { // Broadcasts a message to all connected and authorized users.
		io.to("authorized").emit("log", data);
	},
	users: [] // Returns array of all currently connected users.
	,

	//Events
	onLogin: function(callback) {
		if(running) {throw new Error("You can't set an event after starting the Web-CLI.")}
		else if((typeof callback) !== "function") {throw new Error("Parameter must be of type: 'function'")}

		onLogin = callback;
	}
};




//Internal functions
function print(msg) {
	if(settings.logStatus) {
		let d = new Date();
		console.log(('0'+d.getHours()).slice(-2) + ':' + ('0'+d.getMinutes()).slice(-2) + ':' + ('0'+d.getSeconds()).slice(-2) + '| ' + msg); // Example: "02:24:50| msg"
	}
}

function isWhitelisted(socket) {
	if(settings.whitelist) {
		for(let i = 0; i < settings.whitelist.length; i++) { if(settings.whitelist[i] == socket.handshake.address) return true }
		return false;
	}
}

function isBlacklisted(socket) {
	if(settings.blacklist) {
		for(let i = 0; i < settings.blacklist.length; i++) { if(settings.blacklist[i] == socket.handshake.address) return true }
		return false;
	}
}