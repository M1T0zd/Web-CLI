webcli = require("../web-cli.js");

webcli.setPassword("secret");
webcli.setPort("8080");
webcli.setLogStatus(true);
webcli.setWhitelist("./whitelist.txt");
webcli.setMaxAttempts(2);
webcli.setMaxUsers(2);
webcli.onData(commandHandler);
webcli.onConnect(onConnect);
webcli.onLogin(onLogin);
webcli.start();

function commandHandler(user, data) {
	const args = data.trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if(command === "say") {
		if(!args) return;
		let response = "";
		args.forEach(arg => {response += arg + " "});
		user.send(response); // Send a message back to the user.
	} else if(command === "broadcast") {
		if(!args) return;
		let response = "";
		args.forEach(arg => { response += arg + " " });
		webcli.broadcast(response); // Send to all user.
	} else if(command === "connections") {
		user.send("Connection count: " + webcli.connections.length);
		user.send("Connections:");
		webcli.connections.forEach(connection => {
			user.send(`\tConnection-ID: ${connection.id}, Connection-IP: ${connection.ip}`);
		});
		user.send("");
	} else if(command === "users") {
		user.send("User count: " + webcli.users.length);
		user.send("Users:");
		webcli.users.forEach(u => {
			user.send(`\tUser-ID: ${u.id}, Connection-ID: ${u.connection.id}`);
		});
		user.send("");
	} else if(command === "prompt") { // ToDo
		//let response = user.prompt("Favorite color?");
		//user.send(`${response} is a nice color indeed.`);
	} else if(command === "help") {
		user.send("List of commands:\n" +
		"\tsay\n" +
		"\tbroadcast\n" +
		"\tconnections\n" +
		"\tusers\n");
	} else {
		user.send("Invalid command. Try `help`.");
	}
}


function onConnect(connection) {
	webcli.broadcast(`New connection from [${connection.ip}]`);
}

function onLogin(user) {
	user.send('Welcome Back!');
}