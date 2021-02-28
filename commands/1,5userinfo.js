const Discord = require('discord.js');
const ColorThief = require('colorthief');
module.exports = {
    name: "userinfo",
    code: "`userinfo`",
    description: "Provides information about a certain server member",
    usage: "<tagged server member>",
    guildOnly: true,
    aliases: ["user"],
    execute(message){
        var TagSize = message.mentions.users.size
        if (!TagSize) {
            const SelfAvatar = message.author.displayAvatarURL({format: "png", dynamic: true})
           
            //EMBED
            ColorThief.getColor(SelfAvatar)
              .then(color => {
                const SelfInfo = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(message.author.username + "'s info")
                .setDescription("Avatar:")
                .setImage(SelfAvatar)

                message.channel.send(SelfInfo)
              })
              .catch(err => { console.log(err) })

        }
        else if (TagSize == 1) {
            const taggedUser = message.mentions.users.first()
            const member = message.mentions.members.first()
            const taggedAvatar = taggedUser.displayAvatarURL({format: "png", dynamic:true})
            //EMBED

            ColorThief.getColor(taggedAvatar)
              .then(color => {
                function embed(admin) {
                const userInfo = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(taggedUser.username + "'s Data")
                .setThumbnail(taggedAvatar)
                .addFields(
                  {name: "Username", value: taggedUser, inline: true},
                  {name: "\u200b", value: "\u200b", inline: true},
                  {name: "Discriminator", value: "#" + taggedUser.discriminator, inline: true},
                  {name: "Administrator", value: admin, inline: true},
                  {name: "\u200b", value: "\u200b", inline: true},
                  {name: "User ID", value: member.id, inline: true}

                )

                message.channel.send(userInfo)
                }

                if (member.permissions.has("ADMINISTRATOR")) {
                  embed("True")
                }
                else {
                  embed("False")
                }

              })
              .catch(err => { console.log(err) })

			}
		else if (TagSize > 1) {
            message.channel.reply(", I can only display info of one member at a time")
        }

    }}