module.exports = {
	name: 'ping',
	description: 'Ping!',
	usage: "",
	aliases: [" "],
	execute(message) {
		message.channel.send('Pong!');
	},
};