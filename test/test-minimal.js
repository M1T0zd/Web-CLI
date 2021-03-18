webcli = require("../web-cli.js");

//Default port: 80
//Default logStatus: false

webcli.setPassword("secret");
webcli.onData(commandHandler);
webcli.start();

function commandHandler(user, data)
{
	const args = data.trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if(command === "say")
	{
		let response = "";
		args.forEach(arg => {response += arg + " "});
		if(args) user.send(response); //Send a message back to the client.
	}
	else if (command === "help")
	{
		user.send("List of commands:\n" +
		"\tsay\n");
	}
	else
	{
		user.send("Invalid command. Try `help`.");
	}
}