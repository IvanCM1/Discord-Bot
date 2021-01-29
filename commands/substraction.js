const Discord = require('discord.js');
module.exports = {
    name: "-",
    description: "Makes a substraction of 2 numbers",
    usage: "<number> <number>",
    args: true,
    aliases: ["substracion", "subs"],
    execute(message, args) {
        var decimal = "-Use . to write decimal numbers-"
        var num1 = parseFloat(args[0])
        var num2 = parseFloat(args[1])
        var result = num1 - num2
        const SubsEmbed = new Discord.MessageEmbed()
          .setColor("D2D2D2")
          .setTitle("**Multiplication**")
          .addField("*Your operation:*  **" + num1 + " - " + num2 + "**", "*Result:*  **" + result + "**")
          .setThumbnail("https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/calculator-icon.png")
          .setFooter(decimal)
        message.channel.send(SubsEmbed)
}}