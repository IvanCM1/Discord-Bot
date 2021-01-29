module.exports = {
    name: 'ban',
    description: 'Bans the given user from the server',
    usage: "<@mention of the user to ban>",
    guildOnly: true,
    aliases: [" "],
    permissions: "ADMINISTRATOR",
    execute(message, args) {
        var TagSize = message.mentions.users.size
        if (!TagSize) {
            message.reply("the user to be banned must be `@mentioned`")
        }
        else if (TagSize > 1) {
            message.reply("only one user can be banned at a time")
        }
        else {
            const member = message.mentions.members.first();
            guild.members.ban(member)
            message.channel.send(args[0] + " has been successfully banned from the server")
        }       
    }}