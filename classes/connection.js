/** 
 * Class representing a connection currently active.
 * @hideconstructor
 */
class Connection { // Mostly a socket.io wrapper class
    #socket;
    #id;
    #ip;

	static connections = []

	/**
	 * Randomly generated ID of the connection.
	 * @return {string}
	 */
	get id() { return this.#id; }

	/**
	 * IP address of the connection.
	 * @return {string}
	 */
	get ip() { return this.#ip; }

    constructor(socket) {
        this.#socket = socket;
        this.#id = socket.id;
        this.#ip = socket.handshake.address;

		this.#connect();
		
		this.on('disconnect', () => { // Socket.io reserved disconnect listener
			this.disconnect();
			print(`Connection has been dropped.`, `Connection-ID: ${this.id}`);
		});
    }

	#connect() {
		if((settings.whitelist.length && !this.#isWhitelisted()) || this.#isBlacklisted()) {
			this.alert({msg:'Connection rejected', type: 'error'});
			this.disconnect();
			print(`Connection has been denied.`, `IP: ${this.ip}`)
		} else {
			Connection.connections.push(this);
			this.alert({msg:'Connection established', type:'info'});
			print(`New connection established.`, `Connection-ID: ${this.id}`, `(IP: ${this.ip})`);
		}
	}

	/** Forcefully close the connection. */
	disconnect() {
		Connection.connections.splice(Connection.connections.indexOf(this), 1); // Remove connection from memory.
		this.#socket.disconnect(true);
	}


	// Socket.io wrapper functions

	/** @private */
	emit(topic, message) {
		this.#socket.emit(topic, message);
	}
	
	/** @private */
	send(message) {
		this.#socket.emit('log', message);
	}

	/** @private */
	alert(message) {
		this.#socket.emit('alert', message);
	}

	/** @private */
	on(event, callback) { 
		this.#socket.on(event, callback);
	}

	/** @private */
	off(event, listener) {
		if(listener) {
			this.#socket.removeListener(event, listener);
		} else {
			this.#socket.removeAllListeners(event);
		}
	}

	/** @private */
	join(group) {
		this.#socket.join(group);
	}

	/** @private */
	leave(group) {
		this.#socket.leave(group);
	}


	// Other
	#isWhitelisted() {
		return !!settings.whitelist.find(entry => entry === this.ip);
	}

	#isBlacklisted() {
		return !!settings.blacklist.find(entry => entry === this.ip);
	}
}

const print = require('../globals.js').print;
var settings = require('../settings.js');

module.exports = Connection;