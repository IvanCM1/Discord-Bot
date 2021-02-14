const Discord = require('discord.js');
module.exports = {
    name: 'delete',
    code: "`delete`, ",
    description: 'Deletes a given number of messages from the chat',
    usage: "<number of messages>",
    args: true,
    guildOnly: true,
    aliases: ["prune"],
    permissions: "ADMINISTRATOR",
    execute(message, args) {
        const amount = parseInt(args[0]) + 1
        if (isNaN(amount)) {
            return message.reply("the number of messages to delete must be a number")
        }
        else if (amount <= 1 || amount > 99) {
            return message.reply('the number of messages to delete must be between 1 and 99');
        }
        else
            message.channel.bulkDelete(amount, true).catch(err => {
                console.error(err);
                message.channel.send("An error ocurred while trying to delete messages from this channel")
            })
            const PruneEmbed = new Discord.MessageEmbed()
              .setTitle("Successfully deleted `" + args[0] + "` messages")
              .setColor("#7289DA")
            message.channel.send(PruneEmbed)
        }
};