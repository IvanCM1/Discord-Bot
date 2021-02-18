module.exports = {
    name: "repeat",
    code: "`repeat`, ",
    description: "Repeats whatever you say and deletes your original message",
    args: true,
    usage: "<phrase to repeat>",
    guildOnly: true,
    aliases: ['repetition'],
    execute(message, args) { 
        var repetition = args[0]
		var ArgsLength = args.length
		for (var i = 1; i < ArgsLength; i++) {
			repetition = repetition + " " + args[i]
        }
    message.channel.bulkDelete(1, true)
		message.channel.send(repetition)
    }
}