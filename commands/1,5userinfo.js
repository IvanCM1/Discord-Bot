const Discord = require('discord.js');
const ColorThief = require('colorthief');

module.exports = {
    name: "userinfo",
    code: "`userinfo`",
    description: "Provides information about a certain server member",
    usage: "<mention of a user>",
    guildOnly: true,
    aliases: ["user", "info", "data"],
    execute (message) {

      function noBar(word) {
        let wordArray = word.split("_")
        
        let words = wordArray[0]
        for (j = 1; j < wordArray.length; j++) {
            words += " " + wordArray[j]
        }
        return words
      }
      
      function improve(perm) {
        let text = perm.toLowerCase().split(", ")
        let perms = noBar(text[0].substring(0, 1).toUpperCase() + text[0].substring(1))
        for (i = 1; i < text.length; i++) {
            let word = text[i]
            perms += ", " + noBar(word)
        }
        return perms
      }

      async function info(user, member) {
        color = await ColorThief.getColor(user.displayAvatarURL({format: "png", dynamic: true}))

        let embed = new Discord.MessageEmbed()
          .setColor(color)
          .setTitle(`${user.username}'s Data`)
          .setThumbnail(user.displayAvatarURL())
          .addFields(
            {name: "Username", value: `<@${user.id}>`, inline: true},
            {name: "Discriminator", value: "#" + user.discriminator, inline: true},
          )

        if (user.bot) {
          embed = embed.addField("Bot", "Yes", true)
        }
        else {
          embed = embed.addField("Bot", "No", true)
        }
        embed = embed
        .addField("User ID", user.id, false)
        
        if (member.permissions.has("ADMINISTRATOR")) {
          embed = embed.addField("Administrator", "Yes", true)
        }
        else {
          embed = embed.addField("Administrator", "No", true)
        }
        
        let roles = member.roles.cache.map(roles => roles)

        let rolesString = `<@&${roles[0].id}>`

        for (i = 1; i < roles.length; i++) {
          if (roles[i].name !== "@everyone") {
          rolesString += `, <@&${roles[i].id}>`
          }
        }

        embed = embed.addField("Roles", rolesString, true)

        let permissions = member.permissions.toArray()

        let permissionsString = permissions[0]

        for (i = 1; i < permissions.length; i++) {
          permissionsString += ", " + permissions[i]
        }

        embed = embed.addField("Permissions", improve(permissionsString), false)

        message.channel.send(embed)
      }

        let tagSize = message.mentions.users.size

        if (!tagSize) {
          info(message.author, message.member)
        }
        else if (tagSize == 1) {
            const taggedUser = message.mentions.users.first()
            const taggedMember = message.mentions.members.first()
            info(taggedUser, taggedMember)
  			}
		    else if (tagSize > 1) {
            message.reply(", I can only display info of one member at a time")
        }
    }}