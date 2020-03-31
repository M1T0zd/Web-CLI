$(function(){
	var socket = io();

	$("#login input").keypress(function(e){
		if(e.which == 13)
		{
			socket.emit("login", $("#login input").val());
			$("#login input").val("");
		}
	})

	var lastInput;
	$("#input input").keydown(function(e){
		var data = $("#input input").val();

		if(e.which === 13) //enter
		{
			$("#input input").val("");
			log("> " + data);

			if(data === "clear") $("#terminal p").html("");
			else if(data) socket.emit("data", data);

			
			if(data && data !== commandHistory[0])
			{
				commandHistory.unshift(data);
			}

			historySelector = -1;
		}
		else if(e.which === 38) //up
		{
			historySelector++;
			if(historySelector === 0){lastInput = data}
			else if(historySelector > (commandHistory.length - 1)){historySelector = commandHistory.length - 1;}

			$("#input input").val(commandHistory[historySelector]);

			//Fix to get the cursor to the end.
			var buffer = $("#input input").val();
    		$("#input input").val('');
    		setTimeout(async function(){
    			$("#input input").focus().val(buffer)
    		}, 1)
		}
		else if(e.which === 40) //down
		{
			historySelector--;
			if(historySelector === -1){$("#input input").val(lastInput); lastInput = "";}
			else if(historySelector < -1){historySelector = -1;}
			else{$("#input input").val(commandHistory[historySelector]);}
		}
	});

	socket.on("authorized", function() {
		$("#login").hide();
		$("#block").hide();
		log("Authorized");
	});

	socket.on("log", log);
	
	function log(log)
	{
		console.log(log)

		log = parse(log);

		$("#terminal p").append(log + "<br>");

		$("#terminal").scrollTop($("#terminal")[0].scrollHeight);
	}
});

function parse(text)
{
	text = text.replace(/\n/g, "<br>");
	text = text.replace(/\t/g, "&emsp;");
	text = text.replace(/^\s+/, (s) => (s.replace(/\s/g, '&nbsp;')) );

	return text
}

var historySelector = -1;
var commandHistory = new Array();
