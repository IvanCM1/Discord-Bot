const Discord = require('discord.js');
const simpleYT = require('simpleyt')

module.exports = {
  name: "youtube",
  code: "`youtube` ",
	description: "Displays info from a youtube video",
	usage: "<name of video>",
	args: true,
	aliases: ["yt"],
    execute(message, args) {

      var text = args[0]
      var lu = args.length
      for (var i = 1; i < lu; i++) {
        text = text + " " + args[i]
      }

      simpleYT(text, {filter: "video"}).then(r => {

      const result = r[0]

      console.log(result)
      const video = new Discord.MessageEmbed()
        .setColor("#99AAB5")
        .setAuthor(result.author.name, result.author.profile, result.author.uri)
        .setTitle(result.title)
        .setURL(result.uri)
        //.setDescription(result.description)
        .setImage(result.thumbnails[0].url)
        .addFields(
          //name: "Views:", value: result.views, inline: true},
          {name: "Duration:", value: result.length.sec + "s", inline: true}//,
          //{name: "Uploaded:", value: result.ago, inline:true}
        )
        
      message.channel.send(video)
      })
}}


