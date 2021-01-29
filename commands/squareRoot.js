const Discord = require('discord.js');
module.exports = {
    name: "sqrt",
	description: "Makes the square root of a number",
	usage: "<number>",
	args: true,
	aliases: ["squareroot", "root"],
    execute(message, args) {
        var decimal = "-Use . to write decimal numbers-"
        num1 = parseFloat(args[0])
		var result = Math.sqrt(num1)
		const SqrtEmbed = new Discord.MessageEmbed()
			.setColor("D2D2D2")
			.setTitle("**Square root**")
			.addField("*Your operation:*  **" + "Square root of " + num1 + "**", "*Result:*  **" + result + "**")
			.setThumbnail("https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/calculator-icon.png")
			.setFooter(decimal)
		message.channel.send(SqrtEmbed)
}}