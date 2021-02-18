const Discord = require('discord.js');

module.exports = {
  name: "volume",
  code: "`volume`, ",
	description: "Controls",
	usage: "<the volume from 1 to 100>",
	args: true,
	aliases: [" "],
    execute(message, args) {

const volume = args[0]/100

message.member.voice.channel.join()
          .then(connection => {
            connection.dispatcher.setVolumeLogarithmic(volume)
            message.channel.send("Volume set to: " + args[0])
          })




}}