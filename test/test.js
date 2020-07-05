webCLI = require("../web-cli.js");

webCLI.setPassword("secret");
webCLI.setPort("8080");
webCLI.setLogStatus(true);

webCLI.interpreter(commandHandler);

webCLI.onLogin(onLogin);

webCLI.start();

function commandHandler(message)
{
	const args = message.content.trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if(command === "say")
	{
		let response = "";
		args.forEach(arg => {response += arg + " "});
		if(args) message.respond(response); //Send a message back to the client.
	} else if(command === "confirm") {
		//console.log(webCLI.sendProbe("are you sure?")); //ToDo
	} else if (command === "help") {
		message.respond("List of commands:\n" +
		"\tsay\n" +
		"\tconfirm\n");
	} else {
		message.respond("Invalid command. Try `help`.");
	}
}

function onLogin(){
	message.respond("\thello\n\tbud");
	//webCLI.sendLog("\thello\n\tbud");
}