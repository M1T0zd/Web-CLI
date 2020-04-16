webCLI = require("../web-cli.js");

//Default password: 'admin'
//Default port: 80
//Default logStatus: false

webCLI.interpreter(commandHandler);

webCLI.start();

function commandHandler(command, args)
{
	if(command === "say")
	{
		let response = "";
		args.forEach(arg => {response += arg + " "});
		if(args) webCLI.sendLog(response); //Send a message back to the client.
	}
	else if (command === "help")
	{
		webCLI.sendLog("List of commands:\n" +
		"\tsay\n");
	}
	else
	{
		webCLI.sendLog("Invalid command. Try `help`.");
	}
}