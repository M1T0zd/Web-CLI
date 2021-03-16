'use strict';

const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Classes
const Connection = require('./classes/connection.js');
const User = require('./classes/user.js');


io.on('connection', function(socket) {
	var connection = new Connection(socket);
	connection.attempts = 0;
	connection.on("login", data => User.tryLogin(connection, data));
});

// Global variables and functions
var globals = require('./globals.js');

//System variables
var running = false;
var interpreterIsSet = false;

//Setting variables
var settings = require('./settings.js');

//API FUNCTIONS
module.exports = {
	// Main (ESSENTIAL!)
	start()
	{
		if(!interpreterIsSet) { throw new Error("You must set the 'onData' event before starting!") }
		if(!settings.password) { throw new Error("Password must be set before starting!") }

		print('Starting the Web-CLI...');

		app.use(express.static(__dirname + '/client'));
		server.listen(settings.port);

		running = true;

		print(`Web-CLI running on port '${settings.port}'.\n`);
	},

	// Settings
	setPassword(password) // ESSENTIAL!
	{
		if(running) { throw new Error("You can't change the password after starting the Web-CLI.") }
		else if((typeof password) !== "string") { throw new TypeError("Argument must be of type: 'string'") }

		settings.password = password;
	},
	setPort(port) {
		if(running) { throw new Error("You can't change the port after starting the Web-CLI.") }
		else if(!Number.isInteger(Number(port))) { throw new TypeError("Argument must be an integer.") }

		settings.port = port;
	},
	setMaxAllowedAttempts(maxAllowedAttempts)
	{
		if(running) { throw new Error("You can't change the allowed attempts after starting the Web-CLI.") }
		else if (!Number.isInteger(Number(maxAllowedAttempts))) { throw new TypeError("Argument must be an integer.") }
		
		if(maxAllowedAttempts == 0) { // 0 = unlimited
			settings.maxAllowedAttempts = Infinity; 
		} else {
			settings.maxAllowedAttempts = maxAllowedAttempts;			
		}
	},
	setMaxAllowedUsers(maxAllowedUsers)
	{
		if(running) { throw new Error("You can't change the allowed attempts after starting the Web-CLI.") }
		else if (!Number.isInteger(Number(maxAllowedUsers))) { throw new TypeError("Argument must be an integer.") }

		if(maxAllowedUsers == 0) { // 0 = unlimited
			settings.maxAllowedUsers = Infinity;
		} else {
			settings.maxAllowedUsers = maxAllowedUsers;
		}
	},
	setWhitelist(file)
	{
		if(running) { throw new Error("You can't set a whitelist after starting the Web-CLI.") }
		else if((typeof file) !== "string") { throw new TypeError("Argument must be of type: 'string'") }
		else if(settings.blacklist.length) { throw new ERR_INCOMPATIBLE_OPTION_PAIR("Whitelist cannot be set in combination with the blacklist.") }
		try {
			const fs = require('fs');
			const path = require("path");
			settings.whitelist = fs.readFileSync(path.resolve(path.dirname(require.main.filename), file), "UTF-8").split('\n').filter(x => x);
		} catch (error) {
			if(error.code === "ENOENT") { throw new ENOENT("Whitelist file could not be found.") }
			else { throw new Error(`The whitelist file might be formatted incorrectly or there is another problem.\nError: ${error}`) }
		}
	},
	setBlacklist(file)
	{
		if(running) { throw new Error("You can't set a blacklist after starting the Web-CLI.") }
		else if((typeof file) !== "string") { throw new TypeError("Argument must be of type: 'string'") }
		else if(settings.whitelist.length) { throw new ERR_INCOMPATIBLE_OPTION_PAIR("Blacklist cannot be set in combination with the whitelist.") }
		try {
			const fs = require('fs');
			const path = require("path");
			settings.blacklist = fs.readFileSync(path.resolve(path.dirname(require.main.filename), file), "UTF-8").split('\n').filter(x => x);
		} catch(error) {
			if(error.code === "ENOENT") { throw new ENOENT("Blacklist file could not be found.") }
			else{ throw new Error(`The blacklist file might be formatted incorrectly or there is another problem.\nError: ${error}`) }
		}
	},
	setLogStatus(set)
	{
		if(running) { throw new Error("You can't change the log setting after starting the Web-CLI.") }
		else if((typeof set) !== "boolean") { throw new TypeError("Argument must be of type: 'boolean'") }

		settings.logStatus = set;
	},

	// Events
	onData(interpreter) // ESSENTIAL!
	{
		if(running) { throw new Error("You can't set the interpreter after starting the Web-CLI.") }
		else if((typeof interpreter) !== "function") { throw new TypeError("Argument must be of type: 'function'") }

		globals.onData = interpreter;
		interpreterIsSet = true;
	},
	onLogin(callback) {
		if(running) { throw new Error("You can't set an event after starting the Web-CLI.") }
		else if((typeof callback) !== "function") { throw new TypeError("Argument must be of type: 'function'") }

		globals.onLogin = callback;
	},
	onLogout(callback) {
		if(running) { throw new Error("You can't set an event after starting the Web-CLI.") }
		else if ((typeof callback) !== "function") { throw new TypeError("Argument must be of type: 'function'") }

		globals.onLogout = callback;
	},

	// Utility
	broadcast(data)
	{
		if(!running) { throw new Error("WebCLI must be running first before broadcasting.") }
		io.to("users").emit("log", data);
	},

	// Data
	connections: Connection.connections,
	users: User.users
};

const print = globals.print;