const Discord = require('discord.js');

module.exports = {
  name: "stop",
  code: "`stop`, ",
	description: "Stops the current transmiting audio and removes the queue",
	usage: " ",
	aliases: ["leave", "disconnect"],
    execute(message, args) {

message.member.voice.channel.join()
          .then(connection => {
            connection.disconnect()
            message.channel.send("Music stopped!")
          })

}}