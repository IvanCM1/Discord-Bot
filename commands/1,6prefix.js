const Discord = require('discord.js');
const db = require('quick.db');

//HACER COMANDO PARA ADMINSITRAR TODO DE LAS DATABASES

module.exports = {
    name: 'prefix',
    code: "`prefix`, ",
    description: 'Changes or displays the prefix for this server',
    usage: "<new prefix>",
    guildOnly: true,
    aliases: [" "],
    permissions: "ADMINISTRATOR",
    execute(message, args) {
    
    if (!args[0]) {
      const value = db.get(message.guild.id)
          if (!value) {
            message.channel.send("?")
            }
          else {
            message.channel.send(value)
          }
    }
    else if (args[0].includes("+") || args[0].includes("&") || args[0].includes("%")) {
      message.channel.send(args[0] + " is not a valid prefix")
    }
    else {
      db.set(message.guild.id, args[0])
      .then(() => {
        message.channel.send("Prefix set to: " + args[0])
      })
      .catch(err => {
        message.channel.send(args[0] + " is not a valid prefix")
      })

    }




    
    /*if (args[0] == "new") {
      db.set(message.guild.id, args[1]).then(() => {
        message.channel.send("New data set or changed")
      });
    }
    else {
      db.get(message.guild.id).then(value => {message.channel.send(value)});
    }*/

}}