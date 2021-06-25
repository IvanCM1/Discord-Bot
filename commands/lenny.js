module.exports = {
	name: 'lenny',
  code: "`lenny`, ",
	description: "Sends a Lenny!",
	usage: "",
	aliases: [" "],
	execute(message) {
		message.channel.bulkDelete(1, true)
        message.channel.send("( ͡° ͜ʖ ͡°)")
}}