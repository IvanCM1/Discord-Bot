module.exports = {
    name: 'kick',
    description: 'Kicks the given user from the server',
    usage: "<@mention of the user to kick>",
    guildOnly: true,
    aliases: [" "],
    permissions: "ADMINISTRATOR",
    execute(message, args) {
        var TagSize = message.mentions.users.size
        if (!TagSize) {
            message.reply("the user to be kicked must be `@mentioned`")
        }
        else if (TagSize > 1) {
            message.reply("only one user can be kicked at a time")
        }
        else {
            const member = message.mentions.members.first();
            member.kick();
            message.channel.send(args[0] + " has been successfully kicked from the server")
        }       
    }}