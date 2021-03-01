const Discord = require('discord.js');
const Jikan = require('jikan-node');
const mal = new Jikan();

module.exports = {
  name: 'manga',
  code: "`manga`",
  description: 'Displays the synopsis, score and number of episodes of an anime',
  usage: "<manga to search>",
  args: true,
  aliases: [" "],
	execute(message, args) {
        var mangaName = args[0]
        var argsLength = args.length
        for (i=1; i < argsLength; i++) {
          mangaName = mangaName + " " + args[i]
        }

        mal.search("manga", mangaName, {limit: 1})
          .then(manga => {
            let data = manga.results[0]

            console.log(data)

            mal.findManga(manga.results[0].mal_id)
            .then(info => {
              console.log(info)
            
            let authors = info.authors[0].name

            for (i = 1; i < info.authors.length; i++) {
              authors = authors + " & " + info.authors[i].name
            }

            let genres = info.genres[0].name

            for (i = 1; i < info.genres.length; i++) {
              genres = genres + ", " + info.genres[i].name
            }

            function sendEmbed(volumes, chapters) {
            const animeEmbed = new Discord.MessageEmbed()
                .setColor("#368BD6")
                .setAuthor("By " + authors)
                .setTitle(data.title + " | " + info.title_japanese)
                .setURL(data.url)
                .setThumbnail(data.image_url)
                .setDescription(data.synopsis)
                .addFields(
                  {name: ":star: Score:", value: data.score, inline: true},
                  {name: ":medal: Ranked:", value: info.rank, inline: true},
                  {name: "Popularity:", value: info.popularity, inline: true},
                  {name: "Type:", value: info.type, inline: true},
                  {name: "Status:", value: info.status, inline: true},
                  {name: "\u200b", value: "\u200b", inline: true},
                  {name: "Volumes:", value: volumes, inline: true},
                  {name: "Chapters:", value: chapters, inline: true},
                  //{name: "Premiered:", value: data.premiered, inline: true},
                  {name: "Genres:", value: genres, inline: false}
                )

            message.channel.send(animeEmbed)
            }

            if (data.volumes > 0 && data.chapters > 0) {
              sendEmbed(data.volumes, data.chapters)
            }
            else {
              sendEmbed("---", "---")
            }

            })
            .catch(err => {
              console.log(err)
            })
          })
          .catch(err => {
            console.log(err)
            message.channel.send("Something went wrong")
          })
}}