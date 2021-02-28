const Discord = require('discord.js');
module.exports = {
    name: 'remindme',
    code: "`remindme`, ",
    description: "Reminds you with a message in the given time (less than a day)",
    usage: "<time> <magnitude> <your alert>",
    args: true,
    aliases: ["reminder", "rm"],
	execute(message, args) {

    let tempus = 0
    const givenTime = args[0]
    const magnitude = args[1]
    let reminder = args[2]

    var ArgsLength = args.length

		for (var i = 3; i < ArgsLength; i++) {
      reminder = reminder + " " + args[i]
    }

    const alertEmbed = new Discord.MessageEmbed()
      .setColor("#7289DA")
      .setTitle("You Have A Notification!")
      .addField("Your reminder:", "`" + reminder + "`", true)
      .setThumbnail("https://cdn.discordapp.com/attachments/716716420179951726/813497897697935380/no-bg.png")

    function alert() {
      message.author.send(alertEmbed)
    }

    function confirmation(timeUnit) {
      const confEmbed = new Discord.MessageEmbed()
        .setColor("#7289DA")
        .setTitle("Notification Set")
        .addFields(
          {name: "Time:", value: "`" + givenTime + " " + timeUnit + "`", inline: true},
          {name: "Reminder", value: "`" + reminder + "`", inline: true}
        )
        .setThumbnail("https://cdn.discordapp.com/attachments/716716420179951726/813497897697935380/no-bg.png")
      message.channel.send(confEmbed)
    }

if (isNaN(givenTime)) {
  const NaNembed = new Discord.MessageEmbed()
    .setColor("#7289DA")
    .setTitle("The amount of time is required to be a number")
  message.channel.send(NaNembed)
}
else if (args.length < 3) {
  const RemEmbed = new Discord.MessageEmbed()
    .setColor("#7289DA")
    .setTitle("You must set a reminder")
  message.channel.send(RemEmbed)
}
else {
    switch (magnitude) {
      case "s":
        tempus = givenTime*1000 // Seconds to miliseconds
        confirmation("seconds")
        setTimeout(alert, tempus)
      break;

      case "min":
        tempus = givenTime*60000  // Minutes to miliseconds
        confirmation("minutes")
        setTimeout(alert, tempus)
      break;

      case "h":
        tempus = givenTime*3600000 // Hours to miliseconds
        confirmation("hours")
        setTimeout(alert, tempus)
      break;

      case "d":
        tempus = givenTime*86400000 // Days to miliseconds
        confirmation("days")
        setTimeout(alert, tempus)
      break;

      default:
        const MagEmbed = new Discord.MessageEmbed()
          .setColor("#7289DA")
          .setTitle("That is not a valid magnitude of time!")
          .setDescription("**The available magnitudes are:**\n `s`*(seconds)*, `min`*(minutes)*, `h`*(hours)* **and** `d`*(days)*")
        message.channel.send(MagEmbed)
    }
}
}}