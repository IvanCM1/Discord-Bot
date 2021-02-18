const Discord = require('discord.js');
module.exports = {
  name: "+",
  code: "`+`, ",
	description: "Makes a sum of 2 numbers",
	usage: "<number> <number>",
	args: true,
	aliases: ["addition", "sum"],
    execute(message, args) {
		var decimal = "-Use . to write decimal numbers-"
        var num1 = parseFloat(args[0])
		var num2 = parseFloat(args[1])
		var result = num1 + num2
		const SumEmbed = new Discord.MessageEmbed()
			.setColor("D2D2D2")
			.setTitle("**Sum**")
			.addField("*Your operation:*  **" + num1 + " + " + num2 + "**", "*Result:*  **" + result + "**")
			.setThumbnail("https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/calculator-icon.png")
			.setFooter(decimal)
		message.channel.send(SumEmbed)
    }
}