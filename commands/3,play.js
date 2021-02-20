const ytdl = require('ytdl-core');

module.exports = {
  name: "smth",
  code: "`play`, ",
	description: "Plays audio in your current channel",
	usage: "<youtube link>",
	aliases: [" "],
    execute(message, args) {


const songInfo = ytdl.getInfo(args[0]);
const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
};

message.channel.send(song.title + "\n" + song.url)



function check(state) {
      if (state) {
        message.channel.send("Success!")
      }
      else {
        message.channel.send("Failure!")
      }
}

check(true)



}}