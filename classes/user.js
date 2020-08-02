/*
Class to be passed on to the event methods of the API.
To be used for getting information about the session at hand or to selectively send it a message.
*/

class User {
    #socket;

    constructor(socket) {
        this.#socket = socket
        this.id = socket.id
        this.ip = socket.handshake.address
        this.isLoggedin;
    }

    send(data) {
        this.#socket.emit("log", data);
    }
}

module.exports = User;