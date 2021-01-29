module.exports = {
    name: 'rm',
    description: "Reminds you with a message in the given time (less than a day)",
    usage: "<time in minutes> <alert>",
    args: true,
    aliases: ["remindme"],
	execute(message, args) {
        //Cambia el tiempo a miliseconds
        var minutes = args[0]
        var time = minutes*60000
        //Crea el string con el recordatorio
        var ArgsLength = args.length
        var alert = args[1]
		for (var i = 2; i < ArgsLength; i++) {
            alert = alert + " " + args[i]
        }
        //Respuesta
        message.channel.send("Reminder set for `" + minutes + "` minutes \nYour alert: `" + alert + "`")
        //Timeout y alerta
        setTimeout(function(){message.author.send("**YOU HAVE A REMINDER!** \nYour alert: `" + alert + "`"); }, time)
}}