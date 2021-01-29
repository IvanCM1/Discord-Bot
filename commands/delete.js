module.exports = {
    name: 'delete',
    description: 'Deletes a given number of messages from the chat',
    usage: "<number of messages>",
    args: true,
    guildOnly: true,
    aliases: ["prune"],
    permissions: "ADMINISTRATOR",
    execute(message, args) {
        const amount = parseInt(args[0]) + 1
        if (isNaN(amount)) {
            return message.reply("you must specify a number of messages to delete")
        }
        else if (amount <= 1 || amount > 99) {
            return message.reply('the number of messages to delete must be between 1 and 99');
        }
        else
            message.channel.bulkDelete(amount, true).catch(err => {
                console.error(err);
                message.channel.send("An error ocurred while trying to delete messages from this channel")
            })
            message.channel.send("**`Successfully deleted " + args[0] + " messages`**")
        }
};