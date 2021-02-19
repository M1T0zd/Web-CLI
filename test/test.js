webcli = require("../web-cli.js");

webcli.setPassword("secret");
webcli.setPort("8080");
webcli.setLogStatus(true);
webcli.setWhitelist("./whitelist.txt");
webcli.setMaxAllowedUsers(2);
webcli.onData(commandHandler);
webcli.onLogin(onLogin);
webcli.start();

function commandHandler(user, message) {
	const args = message.trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if(command === "say") {
		let response = "";
		args.forEach(arg => {response += arg + " "});
		if(args) user.send(response); //Send a message back to the client.
	} else if (command === "broadcast") {
		let response = "";
		args.forEach(arg => { response += arg + " " });
		if(args) webcli.broadcast(response); //Send a message back to the client.
	} else if (command === "connections") {
		user.send("Connection count: " + webcli.connections.length);
		user.send("Connections:");
		webcli.connections.forEach(connection => {
			user.send(`\tConnection-ID: ${connection.id}, Connection-IP: ${connection.ip}`);
		});
		user.send("");
	} else if (command === "users") {
		user.send("User count: " + webcli.users.length);
		user.send("Users:");
		webcli.users.forEach(u => {
			user.send(`\tUser-ID: ${u.id}, Connection-ID: ${u.connection.id}`);
		});
		user.send("");
	} else if(command === "confirm") {
		//console.log(webcli.sendProbe("are you sure?")); //ToDo
	} else if (command === "help") {
		user.send("List of commands:\n" +
		"\tsay\n" +
		"\tbroadcast\n" +
		"\tconnections\n" +
		"\tusers\n" +
		"\tconfirm\n");
	} else {
		user.send("Invalid command. Try `help`.");
	}
}

function onLogin(user) {
	user.send('\thello\n\tbud');
}