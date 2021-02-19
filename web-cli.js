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
	// Core (ESSENTIAL!)
	start: function()
	{
		if(!interpreterIsSet) {throw new Error("You must set the 'interpreter' function first.\nUse 'interpreter()' to pass a function to be used as the interpreter")}

		print('Starting the Web-CLI...');

		app.use(express.static(__dirname + '/client'));
		server.listen(settings.port);

		running = true;

		print(`Web-CLI running on port '${settings.port}'.\n`);
	},

	// Settings
	setPassword: function(password) // ESSENTIAL!
	{
		if(running) {throw new Error("You can't change the password after starting the Web-CLI.")}
		else if((typeof password) !== "string") {throw new TypeError("Argument must be of type: 'string'")}

		settings.password = password;
	},
	setPort: function(port) {
		if(running) {throw new Error("You can't change the port after starting the Web-CLI.")}
		else if(!Number.isInteger(Number(port))) {throw new TypeError("Argument must be an integer.")}

		settings.port = port;
	},
	setMaxAllowedAttempts: function(maxAllowedAttempts)
	{
		if(running) {throw new Error("You can't change the allowed attempts after starting the Web-CLI.")}
		else if (!Number.isInteger(Number(maxAllowedAttempts))) { throw new TypeError("Argument must be an integer.") }
		
		settings.maxAllowedAttempts = maxAllowedAttempts;
	},
	setMaxAllowedUsers: function(maxAllowedUsers)
	{
		if(running) { throw new Error("You can't change the allowed attempts after starting the Web-CLI.") }
		else if (!Number.isInteger(Number(maxAllowedUsers))) { throw new TypeError("Argument must be an integer.") }

		settings.maxAllowedUsers = maxAllowedUsers;
	},
	setLogStatus: function(set)
	{
		if(running) {throw new Error("You can't change the log setting after starting the Web-CLI.")}
		else if((typeof set) !== "boolean") {throw new TypeError("Argument must be of type: 'boolean'")}

		settings.logStatus = set;
	},
	setWhitelist: function(file)
	{
		if(running) {throw new Error("You can't set a whitelist after starting the Web-CLI.")}
		else if((typeof file) !== "string") {throw new TypeError("Argument must be of type: 'string'")}
		else if(settings.blacklist.length) {throw new ERR_INCOMPATIBLE_OPTION_PAIR("Whitelist cannot be set in combination with the blacklist.")}
		try {
			const fs = require('fs');
			const path = require("path");
			settings.whitelist = fs.readFileSync(path.resolve(path.dirname(require.main.filename), file), "UTF-8").split('\n').filter(x => x);
		} catch (error) {
			if(error.code === "ENOENT") {throw new ENOENT("Whitelist file could not be found.")}
			else{throw new Error(`The whitelist file might be formatted incorrectly or there is another problem.\nError: ${error}`)}
		}
	},
	setBlacklist: function(file)
	{
		if(running) {throw new Error("You can't set a blacklist after starting the Web-CLI.")}
		else if((typeof file) !== "string") {throw new TypeError("Argument must be of type: 'string'")}
		else if(settings.whitelist.length) {throw new ERR_INCOMPATIBLE_OPTION_PAIR("Blacklist cannot be set in combination with the whitelist.")}
		try {
			const fs = require('fs');
			const path = require("path");
			settings.blacklist = fs.readFileSync(path.resolve(path.dirname(require.main.filename), file), "UTF-8").split('\n').filter(x => x);
		} catch (error) {
			if(error.code === "ENOENT") {throw new ENOENT("Blacklist file could not be found.")}
			else{throw new Error(`The blacklist file might be formatted incorrectly or there is another problem.\nError: ${error}`)}
		}
	},

	// Events
	onData: function (interpreter) // ESSENTIAL!
	{
		if (running) { throw new Error("You can't set the interpreter after starting the Web-CLI.") }
		else if ((typeof interpreter) !== "function") { throw new TypeError("Argument must be of type: 'function'") }

		globals.onData = interpreter;
		interpreterIsSet = true;
	},
	onLogin: function(callback) {
		if(running) {throw new Error("You can't set an event after starting the Web-CLI.")}
		else if((typeof callback) !== "function") {throw new TypeError("Argument must be of type: 'function'")}

		globals.onLogin = callback;
	},
	onLogout: function (callback) {
		if (running) { throw new Error("You can't set an event after starting the Web-CLI.") }
		else if ((typeof callback) !== "function") { throw new TypeError("Argument must be of type: 'function'") }

		globals.onLogout = callback;
	},

	// Utility
	broadcast: function(data)
	{
		io.to("users").emit("log", data);
	},

	// Data
	connections: Connection.connections,
	users: User.users
};

const print = globals.print;