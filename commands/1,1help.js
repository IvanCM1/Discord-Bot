const Discord = require('discord.js');
const prefix = "?";
module.exports = {
    name: "help",
    description: "Gives a list of all the commands or information about a specific command",
    usage: "<command name>",
    code: "`help`, ",
    aliases: ["command", "commands", "info"],
    execute(message, args){
        const data = []
        const { commands } = message.client

        if (!args.length) {
            data.push(commands.map(command => command.code ).join(' '));
            const HelpEmbed = new Discord.MessageEmbed()
            .setColor("#99AAB5")
            .setTitle("Bot Commands")
            .setDescription("The prefix of this bot is `" + prefix + "`\n\n" + data)
            .setFooter('Use '+ prefix + 'help <command name> to get info on a specific command')
            message.channel.send(HelpEmbed)
        }

        else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
       
            const CommandHelp = new Discord.MessageEmbed()
            .setColor("#99AAB5")
            .setTitle(prefix + command.name)
            .setDescription("*" + command.description + "*")
            .addFields(
                {name: "Usage", value: "`"+ prefix + command.name + " " + command.usage + "`", inline: false},
                {name: "Aliases", value: "`" + command.aliases.join("`, `") + "`", inline: false}
            )
            message.channel.send(CommandHelp)
    }}}