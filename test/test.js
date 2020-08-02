webCLI = require("../web-cli.js");

webCLI.setPassword("secret");
webCLI.setPort("8080");
webCLI.setLogStatus(true);
webCLI.setWhitelist("./whitelist.txt");

webCLI.interpreter(commandHandler);

webCLI.onLogin(onLogin);

webCLI.start();

function commandHandler(user, message)
{
	const args = message.trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if(command === "say") {
		let response = "";
		args.forEach(arg => {response += arg + " "});
		if(args) user.send(response); //Send a message back to the client.
	} else if(command === "confirm") {
		//console.log(webCLI.sendProbe("are you sure?")); //ToDo
	} else if (command === "test") {
		user.send(user.id + " | " + user.ip)
	} else if (command === "help") {
		user.send("List of commands:\n" +
		"\tsay\n" +
		"\tconfirm\n");
	} else {
		user.send("Invalid command. Try `help`.");
	}
}

function onLogin(user){
	user.send(`User-ID: ${user.id}\nIP-Address: ${user.ip}\nWelcome`);
	//message.respond("\thello\n\tbud");
	//webCLI.sendLog("\thello\n\tbud");
}