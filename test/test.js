webCLI = require("../web-cli.js");

webCLI.setPassword("secret");
webCLI.setPort("8080");
webCLI.setLogStatus(true);

webCLI.interpreter(commandHandler);

webCLI.onConnect(onConnect);

webCLI.start();

function commandHandler(command, args)
{
	if(command === "say")
	{
		let response = "";
		args.forEach(arg => {response += arg + " "});
		if(args) webCLI.sendLog(response); //Send a message back to the client.
	}
	else if(command === "confirm")
	{
			//console.log(webCLI.sendProbe("are you sure?")); //ToDo
	}
	else if (command === "help")
	{
		webCLI.sendLog("List of commands:\n" +
		"\tsay\n" +
		"\tconfirm\n");
	}
	else
	{
		webCLI.sendLog("Invalid command. Try `help`.");
	}
}

function onConnect(){
	webCLI.sendLog("\thello\n\tbud");
}