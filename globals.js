module.exports = {
	// Events
	onData: function(){}, // Essential!
	onLogin: function(){},
	onLogout: function(){},
	
	// Other
	print: function (msg) {
		if (settings.logStatus) {
			let d = new Date();
			let timestamp = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2) + '| ';
			console.log(timestamp + msg); // Example: "02:24:50| msg"
		}
	},
}

var settings = require('./settings.js');