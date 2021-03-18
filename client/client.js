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

			if(data === "clear") $("#terminal pre").html("");
			else if(data === "exit" || data === "logout") {
				socket.emit("logout");
				showLogin();
			}
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


	socket.on("log", log);

	socket.on("alert", alert);

	socket.on("authorized", () => {
		hideLogin();
		log("Authorized");
	});

	socket.on('disconnect', () => {
		alert({ msg:"Disconnected from server", type:"error" });
		log("Disconnected");
		showLogin();
	});

	function log(log) {
		console.log(log)
		$("#terminal pre").append(log + "<br>");
		$("#terminal").scrollTop($("#terminal")[0].scrollHeight);
	}

	function alert(alert) {
		$("#alert").text(alert.msg);

		switch(alert.type) {
			case "info":
				$("#alert").css("color", "#080");
				break;
			case "warn":
				$("#alert").css("color", "#880");
				break;
			case "error":
				$("#alert").css("color", "#800");
				break;
		}
	}

	// Tools
	function showLogin() {
		$("#login input").val("");
		$("#terminal pre").html("");
		$("#block").show();
	}

	function hideLogin() {
		$("#login input").val("");
		$("#terminal pre").html("");
		$("#block").hide();
	}
});

var historySelector = -1;
var commandHistory = new Array();