module.exports = {
	// Events
	onData(){}, // Essential!
	onConnect(){},
	onDisconnect(){},
	onLogin(){},
	onLogout(){},
	
	print: function(...args) {
		if(!args) return;
		if(!settings.logStatus) return;

		// Create timestamp
		const d = new Date();
		const mm = d.getMonth() + 1; // getMonth() is zero-based
  		const dd = d.getDate();
		const date = [d.getFullYear(), "-",
			(mm>9 ? '' : '0') + mm, "-",
			(dd>9 ? '' : '0') + dd
		   	].join('');
		const time = [('0' + d.getHours()).slice(-2), ':',
		('0' + d.getMinutes()).slice(-2),':',
		('0' + d.getSeconds()).slice(-2)].join('');

		const timestamp = [date, " ", time, '|'].join('');
		
		// Format message
		let msg = "";
		args.forEach(arg => {
			msg += " " + String(arg).padEnd(40);
		});

		console.log(timestamp + msg); // Example: "2021-03-18 02:24:50| msg"
	},
}

var settings = require('./settings.js');