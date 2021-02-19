module.exports = class Connection { // Mostly a socket.io wrapper class
    #socket;
    #id;
    #ip;

	static connections = []

	get id() { return this.#id; }
	get ip() { return this.#ip; }

    constructor(socket) {
        this.#socket = socket;
        this.#id = socket.id;
        this.#ip = socket.handshake.address;

		this.#connect();
		
		this.on('disconnect', () => { // Socket.io reserved disconnect listener
			this.disconnect();
			print(`Connection has been dropped. (Connection-ID: ${this.id})`);
		});
    }

	#connect() {
		if(!this.#isWhitelisted() || this.#isBlacklisted()) {
			this.alert('Connection Rejected');
			this.disconnect();
			print(`Connection has been denied. IP: ${this.ip}`)
		} else {
			Connection.connections.push(this);

			this.alert('Connection Established');
			print(`New connection established. Connection-ID: ${this.id} (IP: ${this.ip})`);
		}
	}

	disconnect() {
		Connection.connections.splice(Connection.connections.indexOf(this), 1); // Remove connection from memory.
		this.#socket.disconnect(true);
	}

	emit(topic, message) {
		this.#socket.emit(topic, message);
	}
	
	send(message) {
		this.#socket.emit('log', message);
	}

	alert(message) {
		this.#socket.emit('log', message);
	}

	on(event, callback) { 
		this.#socket.on(event, callback);
	}

	off(event) {
		this.#socket.removeAllListeners(event);
	}

	join(group) {
		this.#socket.join(group);
	}

	leave(group) {
		this.#socket.removeAllListeners(group)
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