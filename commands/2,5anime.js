const Discord = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();

module.exports = {
  name: 'anime',
  code: "`anime`",
  description: 'Displays the synopsis, score and number of episodes of an anime',
  usage: "<anime to search>",
  args: true,
  aliases: [" "],
	execute(message, args) {
        var animeName = args[0]
        var argsLength = args.length
        for (i=1; i < argsLength; i++) {
          animeName = animeName + " " + args[i]
        }

        mal.search("anime", animeName, {limit: 1})
          .then(anime => {
            let data = anime.results[0]

            mal.findAnime(anime.results[0].mal_id)
            .then(info => {
                        
            let producers = info.producers[0].name

            for (i = 1; i < info.producers.length; i++) {
              producers = producers + ", " + info.producers[i].name
            }

            let studios = info.studios[0].name

            for (i = 1; i < info.studios.length; i++) {
              studios = studios + ", " + info.studios[i].name
            }

            let genres = info.genres[0].name

            for (i = 1; i < info.genres.length; i++) {
              genres = genres + ", " + info.genres[i].name
            }

            function sendEmbed(episodes) {
            const animeEmbed = new Discord.MessageEmbed()
                .setColor("#368BD6")
                .setAuthor("Produced by " + producers)
                .setTitle(data.title + " | " + info.title_japanese)
                .setURL(data.url)
                .setThumbnail(data.image_url)
                .setDescription(data.synopsis)
                .addFields(
                  {name: ":star: Score:", value: data.score, inline: true},
                  {name: ":medal: Ranked:", value: info.rank, inline: true},
                  {name: ":chart_with_upwards_trend: Popularity:", value: info.popularity, inline: true},
                  {name: ":film_frames: Type:", value: info.type, inline: true},
                  {name: ":scales: Rating:", value: data.rated, inline: true},
                  {name: ":page_facing_up: Source:", value: info.source, inline: true},
                  {name: ":satellite: Status:", value: info.status, inline: true},
                  {name: ":cd: Episodes:", value: episodes, inline: true},
                  {name: ":stopwatch: Duration:", value: info.duration, inline: true},
                  //{name: ":desktop: Producers:", value: producers, inline: true},
                  {name: ":clapper: Studios:", value: studios, inline: true},
                  //{name: '\u200B', value: '\u200B', inline: true},
                  //{name: "Premiered:", value: data.premiered, inline: true},
                  {name: ":label: Genres:", value: genres, inline: true}
                )

            message.channel.send(animeEmbed)
            }

            if (data.episodes > 0) {
              sendEmbed(data.episodes)
            }
            else {
              sendEmbed("---")
            }



            })
            .catch(err => {
              console.log(err)
              message.channel.send("Something went wrong")
            })
          })
          .catch(err => {
            console.log(err)
            message.channel.send("Something went wrong ")
          })
}}