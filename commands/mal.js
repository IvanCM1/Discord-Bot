const Discord = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();
module.exports = {
  name: 'anime',
  description: 'Displays the synopsis, score and number of episodes of an anime',
  usage: "<anime to search>",
  args: true,
  aliases: ["mal"],
	execute(message, args) {
        var animeName = args[0]
        var argsLength = args.length
        for (i=0; i < argsLength; i++) {
          animeName = animeName + " " + args[i]
        }

        mal.search("anime", animeName)
            .then(info => {
              const anime = info.results[0]

              var eps = anime.episodes
              if (anime.episodes == 0) {
                eps = "Unknown"
              }

              const animeEmbed = new Discord.MessageEmbed()
                .setColor("#368BD6")
                .setTitle(anime.title)
                .setURL(anime.url)
                .setImage(anime.image_url)
                .setDescription(anime.synopsis)
                .addFields(
                  {name: "Score: ", value: anime.score, inline: true},
                  {name: "Episodes: ", value: eps, inline: true}
                )
                .setFooter("Data taken from MyAnimeList", "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")

              message.channel.send(animeEmbed)
          })

                
}}