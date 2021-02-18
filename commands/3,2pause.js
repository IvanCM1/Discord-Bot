const Discord = require('discord.js');

module.exports = {
  name: "pause",
  code: "`pause`, ",
	description: "Pauses or resumes the current audio",
	usage: " ",
	aliases: ["resume"],
    execute(message, args) {

message.member.voice.channel.join()
          .then(connection => {
            state = connection.dispatcher.paused

if (state == false) {
message.member.voice.channel.join()
          .then(connection => {
            connection.dispatcher.pause()
            message.channel.send("Music paused!")
          })
}
else if (state == true) {
message.member.voice.channel.join()
          .then(connection => {
            connection.dispatcher.resume()
            message.channel.send("Music resumed!")
          })
}
})
}}