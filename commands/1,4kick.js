const Discord = require('discord.js');
module.exports = {
    name: 'kick',
    code: "`kick`, ",
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
            const member = message.mentions.members.first()

            const taggedUser = message.mentions.users.first()
            const taggedAvatar = taggedUser.displayAvatarURL({format: "png", dynamic:true})

            if (member.kickable) {
              member.kick()

              const KickEmbed = new Discord.MessageEmbed()
                .setColor("#7289DA")
                .setTitle("Member kicked")
                .addFields(
                  {name: "Kicked by:", value: message.author, inline: true},
                  {name: "Username:", value: taggedUser, inline: true},
                )
                .setThumbnail(taggedAvatar)
              message.channel.send(KickEmbed)
            }
            else {
              const ErrorEmbed = new Discord.MessageEmbed()
                .setColor("#7289DA")
                .setTitle(member.displayName + " could not be kicked")
                .setDescription('This error can be caused because of several reasons:\n:one: - The bot must have been granted the "Administrator" permission when being invited to the server.\n:two: - The bot must be higher in the role list than the user to kick.\n:three: - The user to kick can not be the owner of the server.')

              message.channel.send(ErrorEmbed)
            }
                         
        }
    }}