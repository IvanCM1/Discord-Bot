const Discord = require('discord.js');
module.exports = {
    name: 'ban',
    code: "`ban`, ",
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
                  {name: "Username:", value: member.displayName, inline: true},
                )
                .setThumbnail(taggedAvatar)
              message.channel.send(KickEmbed)
            }
            else {
              message.channel.send(member.displayName + " could not be kicked")
            }
                         
        }
    }}