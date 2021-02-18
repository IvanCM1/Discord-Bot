const Discord = require('discord.js');
const search = require('youtube-search');
const opts = {
    maxResults: 1,
    key: process.env.YOUTUBE_API_KEY,
    type: "video"
};
const ytdl = require('ytdl-core');

const queue = new Map()






module.exports = {
  name: "play",
  code: "`play`, ",
	description: "Plays audio in your current channel",
	usage: "<youtube link>",
	args: true,
	aliases: [" "],
    execute(message, args) {

const server_queue = queue.get(message.guild.id)

      var song = args[0]
      var lu = args.length
      for (var i = 1; i < lu; i++) {
        song = song + " " + args[i]
      }

      search(song, opts, function (err, results) {
        if(err) return console.log(err)
        let result = results[0]

if (message.member.voice.channel) {
      message.member.voice.channel.join()
          .then(connection => {

          const stream = ytdl(result.link, { filter: 'audioonly' });

          const dispatcher = connection.play(stream)

          dispatcher.on('start', () => {
            message.channel.send(result.title + ' is now playing!');
  
          });//

          dispatcher.on('finish', () => {
            message.channel.send('musicSample.mp3 has finished playing!');
          });//

          })//End of connection function

    } //End of voice channel if


})//End of search function







}}//end of all