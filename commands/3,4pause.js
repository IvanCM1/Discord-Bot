/*const Discord = require('discord.js');

module.exports = {
  name: "pause",
  code: "`pause`, ",
	description: "Pauses or resumes the current audio",
	usage: " ",
	aliases: ["resume"],
    execute(message, args) {

if (!message.member.voice.channel) {
  const noVoiceEmbed = new Discord.MessageEmbed()
  .setTitle(":no_entry: You Need To Be In The Voice Channel Music Is Played At")
  .setColor('#0099ff')

  message.channel.send(noVoiceEmbed)
}
else {

message.member.voice.channel.join()
  .then( connection => {
    if (!connection.dispatcher) {
      const noMusicEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(":no_entry: Music Needs To Be Played In The Voice Channel You Are In")
      
      message.channel.send(noMusicEmbed)
      message.member.voice.channel.leave()
    }
    else {
    const state = connection.dispatcher.paused

if (state == false) {
message.member.voice.channel.join()
          .then(connection => {
            connection.dispatcher.pause()

            const pauseEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(":pause_button: Music Paused!")

            message.channel.send(pauseEmbed)
          })
}
else if (state == true) {
message.member.voice.channel.join()
          .then(connection => {
            connection.dispatcher.resume()

            const resumeEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(":arrow_forward: Music Resumed!") 
            
            message.channel.send(resumeEmbed)
          })
}
}
})
}
}}*/