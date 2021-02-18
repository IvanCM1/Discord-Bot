const Discord = require('discord.js');
const search = require('youtube-search');
const opts = {
    maxResults: 1,
    key: process.env.YOUTUBE_API_KEY,
    type: "video"
};

module.exports = {
  name: "youtube",
  code: "`youtube`, ",
	description: "Displayus info from a youtube video",
	usage: "<name of video>",
	args: true,
	aliases: ["yt"],
    execute(message, args) {

      var text = args[0]
      var lu = args.length
      for (var i = 1; i < lu; i++) {
        text = text + " " + args[i]
      }

      search(text, opts, function (err, results) {
        if(err) return console.log(err)
        let result = results[0]

      const video = new Discord.MessageEmbed()
        .setColor("#99AAB5")
        .setAuthor(result.channelTitle, "https://i.imgur.com/FIq89o3.png", "https://www.youtube.com/channel/" + result.channelId)
        .setTitle(result.title)
        .setURL(result.link)
        .setDescription(result.description)
        .setImage(result.thumbnails.high.url)
        
      message.channel.send(video)
      })
}}


