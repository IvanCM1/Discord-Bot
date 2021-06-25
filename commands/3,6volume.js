const Discord = require('discord.js');

module.exports = {
  name: "volume",
  code: "`volume`",
	description: "Manages the volume of the music",
	usage: "<number from 1 to 100>",
	aliases: [" "],
    execute(message, args) {

const newVolumeLog = args[0]/100

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

if (args.length == 0) {
message.member.voice.channel.join()
          .then(connection => {
            const currentVolume = Math.round(connection.dispatcher.volumeLogarithmic*100)

            const currentVolumeEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(":musical_note: Current Volume: " + currentVolume + "%")

            message.channel.send(currentVolumeEmbed)
          })
}
else if (isNaN(args[0])) {
  const nanEmbed = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle(":no_entry: That Is Not The Correct Usage Of This Command")
  .addFields(
    {name: "To check the current volume:", value: "`?volume`"},
    {name: "To set a new volume:", value: "`?volume <volume from 1 to 100>`"}
  )

  message.channel.send(nanEmbed)
}
else if (args[0] < 0 || args[0] > 100) {
  const invNumberEmbed = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle(":no_entry: The Volume Must Be A Number Between 0 And 100")

  message.channel.send(invNumberEmbed)
}
else {
message.member.voice.channel.join()
          .then(connection => {
            const oldVolume = Math.round(connection.dispatcher.volumeLogarithmic*100)
            
            connection.dispatcher.setVolumeLogarithmic(newVolumeLog)

            const newVolume = newVolumeLog*100

            function sendEmbed(emoji) {
            const volumeEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(emoji + " Volume Changed")
            .addFields(
              {name: "Previous volume:", value: oldVolume + "%", inline: true},
              {name: "New volume:", value: newVolume + "%", inline: true}
            )
            message.channel.send(volumeEmbed)
            }

            if (newVolume == 0) {
              sendEmbed(":mute:")
            }
            else if (oldVolume < newVolume) {
              sendEmbed(":loud_sound:")
            }
            else if (oldVolume > newVolume) {
              sendEmbed(":sound:")
            }
            else if (oldVolume == newVolume) {
              sendEmbed(":sound:")
            }
          })
}
}
})
}
}}