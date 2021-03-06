const Discord = require('discord.js');
const db = require("quick.db")
let prefix = "?";

module.exports = {
    name: "help",
    description: "Gives a list of all the commands or information about a specific command",
    usage: "<command name>",
    code: "`help`, ",
    aliases: ["command", "commands", "info"],
    execute(message, args){
        const data = []
        const { commands } = message.client
        const value = db.get(message.guild.id)

            if (!value) {
              if (!args.length) {
            data.push(commands.map(command => command.code ).join(' '));
            const HelpEmbed = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setTitle("Bot Commands")
            .setDescription("The prefix of this bot is `" + prefix + "`\n\n" + data)
            .setFooter('Use '+ prefix + 'help <command name> to get info on a specific command')
            message.channel.send(HelpEmbed)
        }

        else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
       
            const CommandHelp = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setTitle(prefix + command.name)
            .setDescription("*" + command.description + "*")
            .addFields(
                {name: "Usage", value: "`"+ prefix + command.name + " " + command.usage + "`", inline: false},
                {name: "Aliases", value: "`" + command.aliases.join("`, `") + "`", inline: false}
            )
            message.channel.send(CommandHelp)
          }
            }
            else {
              prefix = value

        if (!args.length) {
            data.push(commands.map(command => command.code ).join(' '));
            const HelpEmbed = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setTitle("Bot Commands")
            .setDescription("The prefix of this bot is `" + prefix + "`\n\n" + data)
            .setFooter('Use '+ prefix + 'help <command name> to get info on a specific command')
            message.channel.send(HelpEmbed)
        }

        else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
       
            const CommandHelp = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setTitle(prefix + command.name)
            .setDescription("*" + command.description + "*")
            .addFields(
                {name: "Usage", value: "`"+ prefix + command.name + " " + command.usage + "`", inline: false},
                {name: "Aliases", value: "`" + command.aliases.join("`, `") + "`", inline: false}
            )
            message.channel.send(CommandHelp)
          }
      }
    }}