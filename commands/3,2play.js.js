const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const { AuthorizationCode } = require('simple-oauth2')
const { getSong } = require('genius-lyrics-api');
const queue = new Map()

const opts = {
  limit: 1
}

let votes = 0
let voters = []

module.exports = {
  name: 'play',
  code: "`play`, ",
  description: "Plays audio from a youtube video in your current channel",
  usage: "<title or link>",
  aliases: [" "],
  async execute(message, args, client) {

    function min_to_mil(min) {

      let time = min.split(":")

      let mil = ((parseInt(time[0])*60) + parseInt(time[1]))*1000

      return mil
    }

    var text = args[0]
    var lu = args.length
    for (var i = 1; i < lu; i++) {
      text = text + " " + args[i]
    }
      //buttons

      let pauseButton = new MessageButton()
        .setLabel("Pause")
        .setStyle("blurple")
        .setID("pause")
        .setEmoji("⏸️")

      let skipButton = new MessageButton()
        .setLabel("Skip")
        .setStyle("blurple")
        .setID("skip")
        .setEmoji("⏩")

      let stopButton = new MessageButton()
        .setLabel("Stop")
        .setStyle("red")
        .setID("stop")
        .setEmoji("⏹️")

      let queueButton = new MessageButton()
        .setLabel("Queue")
        .setStyle("green")
        .setID("queue")
        .setEmoji("📋")

      let lyricsButton = new MessageButton()
        .setLabel("Lyrics")
        .setStyle("green")
        .setID("lyrics")
        .setEmoji("🖊️")

      let volumeUp = new MessageButton()
        .setLabel("Volume Up")
        .setStyle("blurple")
        .setID("volumeUp")
        .setEmoji("⬆️")

      let volumeDown = new MessageButton()
        .setLabel("Volume Down")
        .setStyle("blurple")
        .setID("volumeDown")
        .setEmoji("⬇️")

      let row1 = new MessageActionRow()
        .addComponents([pauseButton, skipButton, stopButton, queueButton, lyricsButton])
      
      let row2 = new MessageActionRow()
        .addComponents([volumeUp, volumeDown])

      //player
      async function player(guild, song) {
        const songQueue = queue.get(guild.id)

        if (!song) {
          songQueue.voiceChannel.leave()
          queue.delete(guild.id)
        }
        else {
              let connection = await songQueue.voiceChannel.join()

              connection.voice.setSelfDeaf(true)

              const stream = await ytdl(song.url, { filter: 'audioonly' });
              const dispatcher = await connection.play(stream)
              dispatcher.setVolumeLogarithmic(0.5)

              dispatcher.on("finish", () => {
                message.channel.send("music finished")
              })

              dispatcher.on("error", e => {
                console.log(e)
                message.channel.send("error")
              })

              dispatcher.on('start', async () => {
                let volume = connection.dispatcher.volumeLogarithmic * 100
                let logVolume = connection.dispatcher.volumeLogarithmic
                let playEmbed = new Discord.MessageEmbed()
                  .setColor('#0099ff')
                  .setAuthor("Now Playing:", "https://cdn.iconscout.com/icon/free/png-256/itunes-2844877-2365226.png")
                  .setTitle(song.title)
                  .setDescription("Song requested by <@" + message.author + ">")
                  .setURL(song.url)
                  .addFields(
                    {name: "Channel:", value: "`" + song.author.name + "`", inline: true},
                    {name: "Duration:", value: "`" + song.duration + "`", inline: true}, 
                    {name: "Volume:", value: volume + "%", inline: true}                   
                  )
                  .setThumbnail(song.bestThumbnail.url)

                let m = await message.channel.send(" ", {components: [row1, row2], embed: playEmbed});

                const filter = (button) => true
                let dur = min_to_mil(result.duration)
                const collector = m.createButtonCollector(filter, { time: dur });

//collector
      collector.on('collect', async b => {
        
        switch (b.id) {
          case "pause":
          if (b.clicker.user.id === message.author.id || b.clicker.member.roles.cache.some(role => role.name.toLowerCase() == "dj") || b.clicker.member.hasPermission("ADMINISTRATOR")) {

            volume = Math.round(logVolume * 100)

                let playEmbed = new Discord.MessageEmbed()
                  .setColor('#0099ff')
                  .setAuthor("Now Playing:", "https://cdn.iconscout.com/icon/free/png-256/itunes-2844877-2365226.png")
                  .setTitle(song.title)
                  .setDescription("Song requested by <@" + message.author + ">")
                  .setURL(song.url)
                  .addFields(
                    {name: "Channel:", value: "`" + song.author.name + "`", inline: true},
                    {name: "Duration:", value: "`" + song.duration + "`", inline: true}, 
                    {name: "Volume:", value: volume + "%", inline: true}                   
                  )
                  .setThumbnail(song.bestThumbnail.url)

            b.reply.defer()

            const state = connection.dispatcher.paused

            if (state) {
              connection.dispatcher.resume()
              pauseButton = pauseButton
                .setEmoji("⏸️")
                .setLabel("Pause")
              
              row1 = new MessageActionRow()
                .addComponents([pauseButton, skipButton, stopButton, queueButton, lyricsButton])
              
              b.message.edit(" ", {components: [row1, row2], embed: playEmbed})
            }
            else if (!state) {
              connection.dispatcher.pause()
              pauseButton = pauseButton
                .setEmoji("▶️")
                .setLabel("Resume")
              
              row1 = new MessageActionRow()
                .addComponents([pauseButton, skipButton, stopButton, queueButton, lyricsButton])
              
              b.message.edit(" ", {components: [row1, row2], embed: playEmbed})
            }

      
            b.message.edit(" ", {components: [row1, row2], embed: playEmbed})
          }
          else {
            b.reply.send("You need a role called DJ or to be the requester of the song to do this", true)
          }
            break;

          case "skip":

          if (voters.some(user => user.id === b.clicker.user.id)) {
            b.reply.send("You have already voted", true)
          }
          else {
          voters.push(b.clicker.user)
          votes++
          let totalVotes = (connection.channel.members.size-1)/2
          const serverQueue = queue.get(b.message.guild.id)

          if (votes >= totalVotes) {
            if (serverQueue.songs.length < 2) {
              b.reply.send("The queue is empty", true)
              voters = voters.filter(e => e !== b.clicker.user)
            }
            else {
              b.reply.defer()
              const songQueue = queue.get(b.message.guild.id)
              songQueue.songs.shift()
                const endEmbed = new Discord.MessageEmbed()
                  .setColor('#0099ff')
                  .setAuthor("Finished Playing:", "https://www.shareicon.net/data/512x512/2016/08/18/809272_multimedia_512x512.png")
                  .setTitle(song.title)
                  .setURL(song.url)
                  .addFields(
                    {name: "Channel:", value: "`" + song.author.name + "`", inline: true},
                    {name: "Duration:", value: "`" + song.duration + "`", inline: true}                    
                  )
                  .setThumbnail(song.bestThumbnail.url)
                b.message.delete()
                b.message.channel.send(endEmbed)
              player(b.message.guild, songQueue.songs[0])
              voters = []
            }
          }
          else if (votes < totalVotes) {
          skipButton = skipButton
            .setLabel(votes + "/" + totalVotes + " voted to skip")
          row1 = new MessageActionRow()
            .addComponents([pauseButton, skipButton, stopButton, queueButton, lyricsButton])
          let left = totalVotes-votes

          b.reply.send("Your vote has been recorded, " + left + " left to skip the song", true)
          b.message.edit(" ", {components: [row1, row2], embed: playEmbed})
          }
          }

            break;

          case "stop":
          if (b.clicker.user.id === message.author.id || b.clicker.member.roles.cache.some(role => role.name.toLowerCase() == "dj") || b.clicker.member.hasPermission("ADMINISTRATOR")) {
            b.reply.defer()
            const serverQueue = queue.get(b.message.guild.id)
      
            serverQueue.songs = []
            serverQueue.voiceChannel.leave()
            queue.delete(message.guild.id)

                const endEmbed = new Discord.MessageEmbed()
                  .setColor('#0099ff')
                  .setAuthor("Stopped Playing:", "https://www.shareicon.net/data/512x512/2016/08/18/809272_multimedia_512x512.png")
                  .setTitle(song.title)
                  .setURL(song.url)
                  .addFields(
                    {name: "Channel:", value: "`" + song.author.name + "`", inline: true},
                    {name: "Duration:", value: "`" + song.duration + "`", inline: true}                    
                  )
                  .setThumbnail(song.bestThumbnail.url)
            b.message.delete()
            b.message.channel.send(endEmbed)

          }
          else {
            b.reply.send("You need a role called DJ or to be the requester of the song to do this", true)
          }

            break;

          case "queue":
          const serverQueue = queue.get(b.message.guild.id)

            let queueEmbed = new Discord.MessageEmbed()
              .setColor("#0099ff")
              .setTitle(":clipboard: Queue")

            for (i in serverQueue.songs) {
              if (i < 25) {
              let sng = serverQueue.songs[i]

              let num = parseInt(i) + 1

              queueEmbed = queueEmbed
                .setDescription("Showing " + num + " songs")
                .addField("**" + num + ".** " + sng.title, "`" + sng.duration + "`")
              }
            }
            b.reply.send(' ', { embed: queueEmbed, ephemeral: true })

            break;

          case "lyrics":
          //songQueue = queue.get(b.message.guild.id)

          currentSong = songQueue.songs[0]

                    const config = {
                      client: {
                        id: '476Now1WWANK1ZGtSSd1zOSNb6SnBY2CZT0ZBWDB9MpXKsEW1Uo8u3TKmlVbJ6Mx',
                        secret: 'S5TtwJrjhOh0f5FJy2c7ViaSe9a-lCIiX2XY5sx4CxNOfUCu8rXQZUhwAskY0DyoiCnEZnwakgrl1MnDARFVrA'
                      },
                      auth: {
                        tokenHost: 'https://api.oauth.com'
                      }
                    };

                    async function run() {
                      const client = new AuthorizationCode(config);

                      const authorizationUri = client.authorizeURL({
                        redirect_uri: 'http://localhost:3000/callback',
                        scope: '<scope>',
                        state: '<state>'
                      });
                    }
                    run();

                    //getting lyrics

                    const options = {
                      apiKey: 'kP4SqV2tfhSYrHjNVwaE5GxJbAFW_APdoKNgJ7vRMIwuJOGENeAfo26KdejuQ72k',
                      title: currentSong.title,
                      artist: '',
                      optimizeQuery: true
                    };

                    let geniusSong = await getSong(options)

                      if (geniusSong.lyrics.length > 2048) {

                        let letra = geniusSong.lyrics[0]

                        for (i = 1; i < 2045; i++) {

                          letra = letra + geniusSong.lyrics[i]
                        }
                          const lyricsEmbed = new Discord.MessageEmbed()
                            .setAuthor("Lyrics for current song:")
                            .setTitle(currentSong.title)
                            .setColor('#0099ff')
                            .setURL(geniusSong.url)
                            .setDescription(letra + "...")
                            .setThumbnail(geniusSong.albumArt)

                          b.reply.send(' ', { embed: lyricsEmbed, ephemeral: true })
                          
                      }

                      else {

                      const lyricsEmbed = new Discord.MessageEmbed()
                        .setAuthor("Lyrics for current song:")
                        .setTitle(currentSong.title)
                        .setColor('#0099ff')
                        .setURL(geniusSong.url)
                        .setDescription(geniusSong.lyrics)
                        .setThumbnail(geniusSong.albumArt)

                      b.reply.send(' ', { embed: lyricsEmbed, ephemeral: true })

                      }


                  

            break;

            case "volumeUp":
              
              if (volume >= 100) {
                b.reply.send("The volume can't be increased past 100%", true)
              }
              else {
              b.reply.defer()
              logVolume = (Math.round((logVolume + 0.1)*100))/100
              dispatcher.setVolumeLogarithmic(logVolume)

              volume = Math.round(logVolume * 100)
              
                let playEmbed = new Discord.MessageEmbed()
                  .setColor('#0099ff')
                  .setAuthor("Now Playing:", "https://cdn.iconscout.com/icon/free/png-256/itunes-2844877-2365226.png")
                  .setTitle(song.title)
                  .setDescription("Song requested by <@" + message.author + ">")
                  .setURL(song.url)
                  .addFields(
                    {name: "Channel:", value: "`" + song.author.name + "`", inline: true},
                    {name: "Duration:", value: "`" + song.duration + "`", inline: true}, 
                    {name: "Volume:", value: volume + "%", inline: true}                   
                  )
                  .setThumbnail(song.bestThumbnail.url)

              b.message.edit(" ", {components: [row1, row2], embed: playEmbed})
              }

            break;

            case "volumeDown":

              if (volume <= 0) {
                b.reply.send("The volume can't be decreased past 0%", true)
              }
              else {
              b.reply.defer()
              logVolume = (Math.round((logVolume - 0.1)*100))/100
              dispatcher.setVolumeLogarithmic(logVolume)

              volume = Math.round(logVolume * 100)
              
                let playEmbed = new Discord.MessageEmbed()
                  .setColor('#0099ff')
                  .setAuthor("Now Playing:", "https://cdn.iconscout.com/icon/free/png-256/itunes-2844877-2365226.png")
                  .setTitle(song.title)
                  .setDescription("Song requested by <@" + message.author + ">")
                  .setURL(song.url)
                  .addFields(
                    {name: "Channel:", value: "`" + song.author.name + "`", inline: true},
                    {name: "Duration:", value: "`" + song.duration + "`", inline: true}, 
                    {name: "Volume:", value: volume + "%", inline: true}                   
                  )
                  .setThumbnail(song.bestThumbnail.url)

              b.message.edit(" ", {components: [row1, row2], embed: playEmbed})
              }

            break;
        }

    
      })
//end of collector
          //end of song
              dispatcher.on("finish", () => {
                songQueue.songs.shift()
                player(guild, songQueue.songs[0])
                const endEmbed = new Discord.MessageEmbed()
                  .setColor('#0099ff')
                  .setAuthor("Finished Playing:", "https://www.shareicon.net/data/512x512/2016/08/18/809272_multimedia_512x512.png")
                  .setTitle(song.title)
                  .setURL(song.url)
                  .addFields(
                    {name: "Channel:", value: "`" + result.author.name + "`", inline: true},
                    {name: "Duration:", value: "`" + result.duration + "`", inline: true}                    
                  )
                  .setThumbnail(song.bestThumbnail.url)

                m.delete()
                m.channel.send(endEmbed);
              });
          });
        }//end of else
      }//end of function player

    const vids = await ytsr(text, opts)

    const result = vids.items[0]

    const serverQueue = queue.get(message.guild.id)

    if (!vids) {
      const erEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(":no_entry: There Is No Existing Youtube Video With That Title")
        .setDescription("The next song in the queue will be played if there is one")

      message.channel.send(erEmbed)
    }
    else {

        if (!message.member.voice.channel) {
          const noVoiceEmbed = new Discord.MessageEmbed()
            .setTitle(":no_entry: You Need To Be In A Voice Channel To Play Music")
            .setColor('#0099ff')

          message.channel.send(noVoiceEmbed)
        }
        else {
          if (!serverQueue) {
            const queueConstructor = {
              voiceChannel: message.member.voice.channel,
              textChannel: message.channel,
              connection: null,
              songs: []
            }

            queue.set(message.guild.id, queueConstructor)
            queueConstructor.songs.push(result)

            const connection = queueConstructor.voiceChannel.join();
            queueConstructor.connection = connection;
            player(message.guild, queueConstructor.songs[0]);

          }
          else {
            serverQueue.songs.push(result)
            const addQueueEmbed = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setAuthor("Added To The Queue:")
              .setTitle(":pushpin: " + result.title)
              .setURL(result.url)
              .setDescription("Requested by: <@" + message.author + ">")
              .addFields(
                {name: "Channel:", value: "`" + result.author.name + "`", inline: true},
                {name: "Duration:", value: "`" + result.duration + "`", inline: true}            
              )
              .setThumbnail(result.bestThumbnail.url)

            message.channel.send(addQueueEmbed)
          }
        }



    }
  }
}