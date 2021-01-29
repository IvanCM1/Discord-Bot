const Discord = require('discord.js');
module.exports = {
    name: "userinfo",
    description: "Provides information about a certain server member",
    usage: "<tagged server member>",
    guildOnly: true,
    aliases: ["user"],
    execute(message){
        var TagSize = message.mentions.users.size
        if (!TagSize) {
            const SelfAvatar = message.author.displayAvatarURL({format: "png", dynamic: true})
            //EMBED
            const SelfInfo = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setTitle(message.author.username + "'s info")
            .setDescription("Avatar:")
            .setImage(SelfAvatar)


            message.channel.send(SelfInfo)
        }
        else if (TagSize == 1) {
            const taggedUser = message.mentions.users.first()
            const taggedAvatar = taggedUser.displayAvatarURL({format: "png", dynamic:true})
            //EMBED
            const UserInfo = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setTitle(taggedUser.username + "'s info")
            .setDescription("Avatar:")
            .setImage(taggedAvatar)


            message.channel.send(UserInfo)
			}
		else if (TagSize > 1) {
            message.channel.reply(", I can only display info of one member at a time")
        }

    }}