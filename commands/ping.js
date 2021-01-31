module.exports = {
	name: 'ping',
	description: 'Ping!',
	usage: "",
	aliases: [" "],
	execute(message) {
    let ping = Date.now() - message.createdTimestamp
		message.channel.send("Latency: " + ping);
	},
};