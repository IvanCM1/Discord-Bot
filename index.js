const fs = require('fs');
const Discord = require('discord.js');
const simpleYT = require('simpleyt')
const ytdl = require('ytdl-core');
const { getLyrics, getSong } = require('genius-lyrics-api');
const ownerID = process.env["OWNER_ID"]
const token = process.env["CLIENT_TOKEN"]
const queue = new Map()
const Database = require("@replit/database")
const db = new Database()
let prefix = "?"

const client = new Discord.Client();
client.commands = new Discord.Collection();

require('discord-buttons')(client)

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {

  console.log('Ready!');
  console.log("Working in " + client.guilds.cache.size + " servers!")

  client.user.setActivity('@Okami', { type: 'LISTENING'/*, url: "https://www.twitch.tv/auronplay"*/ });
});

client.on('message', message => {
  if (message.author.bot) return;

  var msg = message.content.toLowerCase()
  const args = message.content.trim().split(/ +/);

  //Response to messages
  function response(input, output) {
    var IN = input.toLowerCase()
    if (msg.startsWith(IN)) {
      message.channel.send(output)
    }
  }
  response("hola", "Hola")
  response("bala", "**Jie Hao calvooo**")
  response("args", args)

  //Dad joke
  if (msg.includes("im ")) {
    for (i = -1; args[i] !== "im"; i++) { }
    var repetition = args[i + 1]
    var argsLength = args.length - i
    for (j = i + 2; j < argsLength; j++) {
      repetition = repetition + " " + args[j]
    }
    message.channel.send("Hi *" + repetition + "*, I'm **dad**")
  }
  else if (msg.includes("i'm ")) {
    for (i = -1; args[i] !== "i'm"; i++) { }
    var repetition = args[i + 1]
    var argsLength = args.length - i
    for (j = i + 2; j < argsLength; j++) {
      repetition = repetition + " " + args[j]
    }
    message.channel.send("Hi *" + repetition + "*, I'm **dad**")
  }
  else if (msg.includes("i am ")) {
    for (i = -1; args[i] + " " + args[i + 1] !== "i am"; i++) { }
    var repetition = args[i + 2]
    var argsLength = args.length - i
    for (j = i + 3; j < argsLength; j++) {
      repetition = repetition + " " + args[j]
    }
    message.channel.send("Hi *" + repetition + "*, I'm **dad**")
  }
})

//MUSIC COMMANDS & 
client.on('message', message => {
  if (message.author.bot) return;
  let mention = message.mentions.users.first()
  let botID = client.user.id

  if (typeof mention === "undefined") {

  }

  else if (mention.id == botID) {
    const data = []
    const { commands } = message.client
    db.get(message.guild.id)
      .then(value => {
        if (!value) {
          data.push(commands.map(command => command.code).join(' '));
          const HelpEmbed = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setTitle("Bot Commands")
            .setDescription("The prefix of this bot is `" + prefix + "`\n\n" + data)
            .setFooter('Use ' + prefix + 'help <command name> to get info on a specific command')
          message.channel.send(HelpEmbed)
        }
        else {
          prefix = value
          data.push(commands.map(command => command.code).join(' '));
          const HelpEmbed = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setTitle("Bot Commands")
            .setDescription("The prefix of this bot is `" + prefix + "`\n\n" + data)
            .setFooter('Use ' + prefix + 'help <command name> to get info on a specific command')
          message.channel.send(HelpEmbed)
        }
      })
  }
  db.get(message.guild.id)
    .then(value => {
      if (!value) {

        var msg = message.content.toLowerCase()
        const args = message.content.trim().split(/ +/);
        const cmnd = args[0]

        if (cmnd === prefix + "play" || cmnd === prefix + "stop" || cmnd === prefix + "skip" || cmnd === prefix + "leave" || cmnd === prefix + "disconnect" || cmnd === prefix + "lyrics" || cmnd === prefix + "queue" || cmnd === prefix + "list") {

          const serverQueue = queue.get(message.guild.id)

          var song = args[1]
          var lu = args.length
          for (var i = 2; i < lu; i++) {
            song = song + " " + args[i]
          }

          function player(guild, song, pre) {
            const songQueue = queue.get(guild.id)

            if (!song) {
              songQueue.voiceChannel.leave()
              queue.delete(guild.id)
            }
            else {
              simpleYT(song, { filter: "video" }).then(r => {
                const result = r[0]

                if (!result) {
                  songQueue.songs.shift()
                  player(guild, songQueue.songs[0])

                  const erEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(":no_entry: There Is No Existing Youtube Video With That Title")
                    .setDescription("The next song in the queue will be played if there is one")

                  message.channel.send(erEmbed)
                }

                else {


                  songQueue.voiceChannel.join()
                    .then(connection => {

                      const stream = ytdl(result.uri, { filter: 'audioonly' });

                      const dispatcher = connection.play(stream)
                      dispatcher.setVolumeLogarithmic(0.25)

                      dispatcher.on('start', () => {
                        connection.voice.setSelfDeaf(true);

                        const playEmbed = new Discord.MessageEmbed()
                          .setColor('#0099ff')
                          .setAuthor("Now Playing:", "https://cdn.iconscout.com/icon/free/png-256/itunes-2844877-2365226.png")
                          .setTitle(result.title)
                          .setURL(result.uri)
                          .addFields(
                            //{name: "Duration:", value: result.length.sec + "s", inline: true}//,
                            //{name: "Uploaded by:", value: result.author.name, inline: true}
                          )
                          .setThumbnail(result.thumbnails[0].url)

                        message.channel.send(playEmbed);

                      });
                      dispatcher.on('finish', () => {
                        songQueue.songs.shift()
                        player(guild, songQueue.songs[0])
                        const endEmbed = new Discord.MessageEmbed()
                          .setColor('#0099ff')
                          .setAuthor("Finished Playing:", "https://www.shareicon.net/data/512x512/2016/08/18/809272_multimedia_512x512.png")
                          .setTitle(result.title)
                          .setURL(result.uri)
                          .setThumbnail(result.thumbnails[0].url)

                        message.channel.send(endEmbed);
                      });
                    })//end of connection function
                }
              })//end of search function
            }//end of else
          }//end of function player
          //?play
          if (cmnd === prefix + "play") {
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
                queueConstructor.songs.push(song)

                const connection = queueConstructor.voiceChannel.join();
                queueConstructor.connection = connection;
                player(message.guild, queueConstructor.songs[0]);

              }
              else {
                serverQueue.songs.push(song)
                const addQueueEmbed = new Discord.MessageEmbed()
                  .setColor('#0099ff')
                  .setTitle(":pushpin: Song Added To The Queue")

                message.channel.send(addQueueEmbed)
              }
            }
          }//end of ?play          //?stop
          else if (cmnd === prefix + "stop" || cmnd === prefix + "leave" || cmnd === prefix + "disconnect") {
            if (!message.member.voice.channel) {
              const noVoiceEmbed = new Discord.MessageEmbed()
                .setTitle(":no_entry: You Need To Be In The Voice Channel Music Is Played At")
                .setColor('#0099ff')

              message.channel.send(noVoiceEmbed)
            }
            else {

              message.member.voice.channel.join()
                .then(connection => {
                  if (!connection.dispatcher) {
                    const noMusicEmbed = new Discord.MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle(":no_entry: Music Needs To Be Played In The Voice Channel You Are In")

                    message.channel.send(noMusicEmbed)
                    message.member.voice.channel.leave()
                  }
                  else {

                    serverQueue.songs = []
                    serverQueue.voiceChannel.leave()
                    queue.delete(message.guild.id)

                    const stopEmbed = new Discord.MessageEmbed()
                      .setTitle(":stop_button: Music Stopped And Queue Cleared!")
                      .setColor('#0099ff')

                    message.channel.send(stopEmbed)
                  }
                })
            }
          }
          //?skip
          else if (cmnd === prefix + "skip") {
            if (!message.member.voice.channel) {
              const noVoiceEmbed = new Discord.MessageEmbed()
                .setTitle(":no_entry: You Need To Be In The Voice Channel Music Is Played At")
                .setColor('#0099ff')

              message.channel.send(noVoiceEmbed)
            }
            else {

              message.member.voice.channel.join()
                .then(connection => {
                  if (!connection.dispatcher) {
                    const noMusicEmbed = new Discord.MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle(":no_entry: Music Needs To Be Played In The Voice Channel You Are In")

                    message.channel.send(noMusicEmbed)
                    message.member.voice.channel.leave()
                  }
                  else {
                    if (!serverQueue || serverQueue.songs.length < 2) {
                      const noSongsEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(":no_entry_sign: The Queue Is Empty")

                      message.channel.send(noSongsEmbed)
                    }
                    else {
                      const songQueue = queue.get(message.guild.id)
                      songQueue.songs.shift()
                      player(message.guild, songQueue.songs[0])

                      const skipEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(":fast_forward: Skipped To Next Song")

                      message.channel.send(skipEmbed)
                    }
                  }
                })
            }
          }
          //?lyrics
          else if (cmnd === prefix + "lyrics") {
            if (!message.member.voice.channel) {
              const noVoiceEmbed = new Discord.MessageEmbed()
                .setTitle(":no_entry: You Need To Be In The Voice Channel Music Is Played At")
                .setColor('#0099ff')

              message.channel.send(noVoiceEmbed)
            }
            else {

              message.member.voice.channel.join()
                .then(connection => {
                  if (!connection.dispatcher) {
                    const noMusicEmbed = new Discord.MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle(":no_entry: Music Needs To Be Played In The Voice Channel You Are In")

                    message.channel.send(noMusicEmbed)
                    message.member.voice.channel.leave()
                  }
                  else {
                    message.channel.send("success")
                  }
                })
            }
          }
          //?queue
          else if (cmnd === prefix + "queue" || cmnd === prefix + "list") {
            if (!message.member.voice.channel) {
              const noVoiceEmbed = new Discord.MessageEmbed()
                .setTitle(":no_entry: You Need To Be In The Voice Channel Music Is Played At")
                .setColor('#0099ff')

              message.channel.send(noVoiceEmbed)
            }
            else {

              message.member.voice.channel.join()
                .then(connection => {
                  if (!connection.dispatcher) {
                    const noMusicEmbed = new Discord.MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle(":no_entry: Music Needs To Be Played In The Voice Channel You Are In")

                    message.channel.send(noMusicEmbed)
                    message.member.voice.channel.leave()
                  }
                  else {

                    function list(initNum, lun, len, lon, page, queuePages) {
                      switch (lun) {
                        case 1:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result = r[0]
                            const queue1Embed = new Discord.MessageEmbed()
                              .setColor('#0099ff')
                              .setTitle(":clipboard: Queue")
                              .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                              .addFields(
                                { name: initNum + 1 + ". " + result.title, value: result.length.sec + " seconds", inline: true }
                              )
                            message.channel.send(queue1Embed)
                          })
                          break;
                        case 2:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              const queue2Embed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(":clipboard: Queue")
                                .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                .addFields(
                                  { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                  { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false }
                                )
                              message.channel.send(queue2Embed)
                            })
                          })
                          break;
                        case 3:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                const queue3Embed = new Discord.MessageEmbed()
                                  .setColor('#0099ff')
                                  .setTitle(":clipboard: Queue")
                                  .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                  .addFields(
                                    { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                    { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                    { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false }
                                  )
                                message.channel.send(queue3Embed)
                              })
                            })
                          })
                          break;
                        case 4:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  const queue4Embed = new Discord.MessageEmbed()
                                    .setColor('#0099ff')
                                    .setTitle(":clipboard: Queue")
                                    .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                    .addFields(
                                      { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                      { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                      { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                      { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false }
                                    )
                                  message.channel.send(queue4Embed)
                                })
                              })
                            })
                          })
                          break;
                        case 5:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    const queue5Embed = new Discord.MessageEmbed()
                                      .setColor('#0099ff')
                                      .setTitle(":clipboard: Queue")
                                      .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                      .addFields(
                                        { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                        { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                        { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                        { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                        { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false }
                                      )
                                    message.channel.send(queue5Embed)
                                  })
                                })
                              })
                            })
                          })
                          break;
                        case 6:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      const queue6Embed = new Discord.MessageEmbed()
                                        .setColor('#0099ff')
                                        .setTitle(":clipboard: Queue")
                                        .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                        .addFields(
                                          { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                          { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                          { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                          { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                          { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                          { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false }
                                        )
                                      message.channel.send(queue6Embed)
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                        case 7:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      simpleYT(serverQueue.songs[initNum + 6], { filter: "video" }).then(r => {
                                        const result7 = r[0]
                                        const queue7Embed = new Discord.MessageEmbed()
                                          .setColor('#0099ff')
                                          .setTitle(":clipboard: Queue")
                                          .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                          .addFields(
                                            { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                            { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                            { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                            { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                            { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                            { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false },
                                            { name: initNum + 7 + ". " + result7.title, value: result7.length.sec + " seconds", inline: false }
                                          )
                                        message.channel.send(queue7Embed)
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                        case 8:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      simpleYT(serverQueue.songs[initNum + 6], { filter: "video" }).then(r => {
                                        const result7 = r[0]
                                        simpleYT(serverQueue.songs[initNum + 7], { filter: "video" }).then(r => {
                                          const result8 = r[0]
                                          const queue8Embed = new Discord.MessageEmbed()
                                            .setColor('#0099ff')
                                            .setTitle(":clipboard: Queue")
                                            .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                            .addFields(
                                              { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                              { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                              { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                              { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                              { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                              { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false },
                                              { name: initNum + 7 + ". " + result7.title, value: result7.length.sec + " seconds", inline: false },
                                              { name: initNum + 8 + ". " + result8.title, value: result8.length.sec + " seconds", inline: false }
                                            )
                                          message.channel.send(queue8Embed)
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                        case 9:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      simpleYT(serverQueue.songs[initNum + 6], { filter: "video" }).then(r => {
                                        const result7 = r[0]
                                        simpleYT(serverQueue.songs[initNum + 7], { filter: "video" }).then(r => {
                                          const result8 = r[0]
                                          simpleYT(serverQueue.songs[initNum + 8], { filter: "video" }).then(r => {
                                            const result9 = r[0]
                                            const queue9Embed = new Discord.MessageEmbed()
                                              .setColor('#0099ff')
                                              .setTitle(":clipboard: Queue")
                                              .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                              .addFields(
                                                { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                                { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                                { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                                { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                                { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                                { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false },
                                                { name: initNum + 7 + ". " + result7.title, value: result7.length.sec + " seconds", inline: false },
                                                { name: initNum + 8 + ". " + result8.title, value: result8.length.sec + " seconds", inline: false },
                                                { name: initNum + 9 + ". " + result9.title, value: result9.length.sec + " seconds", inline: false }
                                              )
                                            message.channel.send(queue9Embed)
                                          })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                        case 10:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      simpleYT(serverQueue.songs[initNum + 6], { filter: "video" }).then(r => {
                                        const result7 = r[0]
                                        simpleYT(serverQueue.songs[initNum + 7], { filter: "video" }).then(r => {
                                          const result8 = r[0]
                                          simpleYT(serverQueue.songs[initNum + 8], { filter: "video" }).then(r => {
                                            const result9 = r[0]
                                            simpleYT(serverQueue.songs[initNum + 9], { filter: "video" }).then(r => {
                                              const result10 = r[0]
                                              const queue10Embed = new Discord.MessageEmbed()
                                                .setColor('#0099ff')
                                                .setTitle(":clipboard: Queue")
                                                .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                                .addFields(
                                                  { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                                  { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                                  { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                                  { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                                  { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                                  { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false },
                                                  { name: initNum + 7 + ". " + result7.title, value: result7.length.sec + " seconds", inline: false },
                                                  { name: initNum + 8 + ". " + result8.title, value: result8.length.sec + " seconds", inline: false },
                                                  { name: initNum + 9 + ". " + result9.title, value: result9.length.sec + " seconds", inline: false },
                                                  { name: initNum + 10 + ". " + result10.title, value: result10.length.sec + " seconds", inline: false }
                                                )
                                              message.channel.send(queue10Embed)
                                            })
                                          })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                        default:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      simpleYT(serverQueue.songs[initNum + 6], { filter: "video" }).then(r => {
                                        const result7 = r[0]
                                        simpleYT(serverQueue.songs[initNum + 7], { filter: "video" }).then(r => {
                                          const result8 = r[0]
                                          simpleYT(serverQueue.songs[initNum + 8], { filter: "video" }).then(r => {
                                            const result9 = r[0]
                                            simpleYT(serverQueue.songs[initNum + 9], { filter: "video" }).then(r => {
                                              const result10 = r[0]
                                              const queue10Embed = new Discord.MessageEmbed()
                                                .setColor('#0099ff')
                                                .setTitle(":clipboard: Queue")
                                                .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                                .addFields(
                                                  { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                                  { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                                  { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                                  { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                                  { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                                  { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false },
                                                  { name: initNum + 7 + ". " + result7.title, value: result7.length.sec + " seconds", inline: false },
                                                  { name: initNum + 8 + ". " + result8.title, value: result8.length.sec + " seconds", inline: false },
                                                  { name: initNum + 9 + ". " + result9.title, value: result9.length.sec + " seconds", inline: false },
                                                  { name: initNum + 10 + ". " + result10.title, value: result10.length.sec + " seconds", inline: false }
                                                )
                                              message.channel.send(queue10Embed)
                                            })
                                          })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                      }
                    }
                    let len = serverQueue.songs.length
                    let lon = serverQueue.songs.length

                    let queuePages = 1

                    while (len > 10) {
                      len = len - 10
                      queuePages++
                    }

                    if (!args[1] || args[1] == 1 || isNaN(args[1])) {
                      const loadEmbed = new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(":arrows_counterclockwise: The Queue May Take A Few Seconds To Load")

                      message.channel.send(loadEmbed)
                      list(0, lon, lon, lon, 1, queuePages) //list(initNum, lun, len, lon, page, queuePages)
                    }
                    else if (args[1] < 1) {
                      const invalidEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(":no_entry: The Queue Does Not Have Zero Or A Negative Number Of Pages")

                      message.channel.send(invalidEmbed)
                    }
                    else if (args[1] > queuePages) {
                      const noPagesEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(":no_entry: The Queue Does Not Have So Many Pages")

                      message.channel.send(noPagesEmbed)
                    }
                    else {
                      const loadEmbed = new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(":arrows_counterclockwise: The Queue May Take A Few Seconds To Load")

                      message.channel.send(loadEmbed)

                      const initialNum = 10 * args[1] - 10

                      if (queuePages == args[1]) {
                        list(initialNum, len, len, lon, args[1], queuePages)
                      }
                      else {
                        list(initialNum, 10, 10, lon, args[1], queuePages)
                      }
                    }
                  }
                })
            }
          }
        }//end of if all commands
      }
      else {
        prefix = value
        var msg = message.content.toLowerCase()
        const args = message.content.trim().split(/ +/);
        const cmnd = args[0]

        if (cmnd === prefix + "play" || cmnd === prefix + "stop" || cmnd === prefix + "skip" || cmnd === prefix + "leave" || cmnd === prefix + "disconnect" || cmnd === prefix + "queue" || cmnd === prefix + "list" || cmnd === prefix + "lyrics") {

          const serverQueue = queue.get(message.guild.id)

          var song = args[1]
          var lu = args.length
          for (var i = 2; i < lu; i++) {
            song = song + " " + args[i]
          }

          function player(guild, song, pre) {
            const songQueue = queue.get(guild.id)

            if (!song) {
              songQueue.voiceChannel.leave()
              queue.delete(guild.id)
            }
            else {
              simpleYT(song, { filter: "video" }).then(r => {
                const result = r[0]

                if (!result) {
                  songQueue.songs.shift()
                  player(guild, songQueue.songs[0])

                  const erEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(":no_entry: There Is No Existing Youtube Video With That Title")
                    .setDescription("The next song in the queue will be played if there is one")

                  message.channel.send(erEmbed)
                }

                else {


                  songQueue.voiceChannel.join()
                    .then(connection => {

                      const stream = ytdl(result.uri, { filter: 'audioonly' });

                      const dispatcher = connection.play(stream)
                      dispatcher.setVolumeLogarithmic(0.25)

                      dispatcher.on('start', () => {
                        connection.voice.setSelfDeaf(true);

                        const playEmbed = new Discord.MessageEmbed()
                          .setColor('#0099ff')
                          .setAuthor("Now Playing:", "https://cdn.iconscout.com/icon/free/png-256/itunes-2844877-2365226.png")
                          .setTitle(result.title)
                          .setURL(result.uri)
                          .addFields(
                            //{name: "Duration:", value: result.length.sec + "s", inline: true}//,
                            //{name: "Uploaded by:", value: result.author.name, inline: true}
                          )
                          .setThumbnail(result.thumbnails[0].url)

                        message.channel.send(playEmbed);

                      });
                      dispatcher.on('finish', () => {
                        songQueue.songs.shift()
                        player(guild, songQueue.songs[0])
                        const endEmbed = new Discord.MessageEmbed()
                          .setColor('#0099ff')
                          .setAuthor("Finished Playing:", "https://www.shareicon.net/data/512x512/2016/08/18/809272_multimedia_512x512.png")
                          .setTitle(result.title)
                          .setURL(result.uri)
                          .setThumbnail(result.thumbnails[0].url)

                        message.channel.send(endEmbed);
                      });
                    })//end of connection function
                }
              })//end of search function
            }//end of else
          }//end of function player
          //?play
          if (cmnd === prefix + "play") {
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
                queueConstructor.songs.push(song)

                const connection = queueConstructor.voiceChannel.join();
                queueConstructor.connection = connection;
                player(message.guild, queueConstructor.songs[0]);

              }
              else {
                serverQueue.songs.push(song)
                const addQueueEmbed = new Discord.MessageEmbed()
                  .setColor('#0099ff')
                  .setTitle(":pushpin: Song Added To The Queue")

                message.channel.send(addQueueEmbed)
              }
            }
          }//end of ?play          //?stop
          else if (cmnd === prefix + "stop" || cmnd === prefix + "leave" || cmnd === prefix + "disconnect") {
            if (!message.member.voice.channel) {
              const noVoiceEmbed = new Discord.MessageEmbed()
                .setTitle(":no_entry: You Need To Be In The Voice Channel Music Is Played At")
                .setColor('#0099ff')

              message.channel.send(noVoiceEmbed)
            }
            else {

              message.member.voice.channel.join()
                .then(connection => {
                  if (!connection.dispatcher) {
                    const noMusicEmbed = new Discord.MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle(":no_entry: Music Needs To Be Played In The Voice Channel You Are In")

                    message.channel.send(noMusicEmbed)
                    message.member.voice.channel.leave()
                  }
                  else {

                    serverQueue.songs = []
                    serverQueue.voiceChannel.leave()
                    queue.delete(message.guild.id)

                    const stopEmbed = new Discord.MessageEmbed()
                      .setTitle(":stop_button: Music Stopped And Queue Cleared!")
                      .setColor('#0099ff')

                    message.channel.send(stopEmbed)
                  }
                })
            }
          }
          else if (cmnd === prefix + "skip") {
            if (!message.member.voice.channel) {
              const noVoiceEmbed = new Discord.MessageEmbed()
                .setTitle(":no_entry: You Need To Be In The Voice Channel Music Is Played At")
                .setColor('#0099ff')

              message.channel.send(noVoiceEmbed)
            }
            else {

              message.member.voice.channel.join()
                .then(connection => {
                  if (!connection.dispatcher) {
                    const noMusicEmbed = new Discord.MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle(":no_entry: Music Needs To Be Played In The Voice Channel You Are In")

                    message.channel.send(noMusicEmbed)
                    message.member.voice.channel.leave()
                  }
                  else {
                    if (!serverQueue || serverQueue.songs.length < 2) {
                      const noSongsEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(":no_entry_sign: The Queue Is Empty")

                      message.channel.send(noSongsEmbed)
                    }
                    else {
                      const songQueue = queue.get(message.guild.id)
                      songQueue.songs.shift()
                      player(message.guild, songQueue.songs[0])

                      const skipEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(":fast_forward: Skipped To Next Song")

                      message.channel.send(skipEmbed)
                    }
                  }
                })
            }
          }
          //?lyrics
          else if (cmnd === prefix + "lyrics") {
            if (!message.member.voice.channel) {
              const noVoiceEmbed = new Discord.MessageEmbed()
                .setTitle(":no_entry: You Need To Be In The Voice Channel Music Is Played At")
                .setColor('#0099ff')

              message.channel.send(noVoiceEmbed)
            }
            else {

              message.member.voice.channel.join()
                .then(connection => {
                  if (!connection.dispatcher) {
                    const noMusicEmbed = new Discord.MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle(":no_entry: Music Needs To Be Played In The Voice Channel You Are In")

                    message.channel.send(noMusicEmbed)
                    message.member.voice.channel.leave()
                  }
                  else {

                    let songTitle = serverQueue.songs[0]

                    //authentificating

                    const config = {
                      client: {
                        id: '476Now1WWANK1ZGtSSd1zOSNb6SnBY2CZT0ZBWDB9MpXKsEW1Uo8u3TKmlVbJ6Mx',
                        secret: 'S5TtwJrjhOh0f5FJy2c7ViaSe9a-lCIiX2XY5sx4CxNOfUCu8rXQZUhwAskY0DyoiCnEZnwakgrl1MnDARFVrA'
                      },
                      auth: {
                        tokenHost: 'https://api.oauth.com'
                      }
                    };

                    const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');

                    async function run() {
                      const client = new AuthorizationCode(config);

                      const authorizationUri = client.authorizeURL({
                        redirect_uri: 'http://localhost:3000/callback',
                        scope: '<scope>',
                        state: '<state>'
                      });

                      const tokenParams = {
                        code: '<code>',
                        redirect_uri: 'http://localhost:3000/callback',
                        scope: '<scope>',
                      };

                      try {
                        const accessToken = await client.getToken(tokenParams);
                      } catch (error) {
                        console.log('Access Token Error', error.message);
                      }
                    }

                    run();

                    //data request
                    const options = {
                      apiKey: 'kP4SqV2tfhSYrHjNVwaE5GxJbAFW_APdoKNgJ7vRMIwuJOGENeAfo26KdejuQ72k',
                      title: songTitle,
                      artist: '',
                      optimizeQuery: true
                    };

                    getSong(options).then(song => {

                      if (song.lyrics.length > 2048) {

                        let letra = song.lyrics[0]

                        for (i = 1; i < 2045; i++) {

                          letra = letra + song.lyrics[i]
                        }
                          const lyricsEmbed = new Discord.MessageEmbed()
                            .setTitle("Lyrics for current song | " + songTitle)
                            .setURL(song.url)
                            .setDescription(letra + "...")
                            .setThumbnail(song.albumArt)

                          message.channel.send(lyricsEmbed)
                      }

                      else {

                      const lyricsEmbed = new Discord.MessageEmbed()
                        .setTitle("Lyrics for current song | " + songTitle)
                        .setURL(song.url)
                        .setDescription(song.lyrics)
                        .setThumbnail(song.albumArt)

                      message.channel.send(lyricsEmbed)

                      }
                    })
                      .catch(err => {
                        console.log(err)
                      })
                  }
                })
            }
          }
          //?queue
          else if (cmnd === prefix + "queue" || cmnd === prefix + "list") {
            if (!message.member.voice.channel) {
              const noVoiceEmbed = new Discord.MessageEmbed()
                .setTitle(":no_entry: You Need To Be In The Voice Channel Music Is Played At")
                .setColor('#0099ff')

              message.channel.send(noVoiceEmbed)
            }
            else {

              message.member.voice.channel.join()
                .then(connection => {
                  if (!connection.dispatcher) {
                    const noMusicEmbed = new Discord.MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle(":no_entry: Music Needs To Be Played In The Voice Channel You Are In")

                    message.channel.send(noMusicEmbed)
                    message.member.voice.channel.leave()
                  }
                  else {

                    function list(initNum, lun, len, lon, page, queuePages) {
                      switch (lun) {
                        case 1:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result = r[0]
                            const queue1Embed = new Discord.MessageEmbed()
                              .setColor('#0099ff')
                              .setTitle(":clipboard: Queue")
                              .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                              .addFields(
                                { name: initNum + 1 + ". " + result.title, value: result.length.sec + " seconds", inline: true }
                              )
                            message.channel.send(queue1Embed)
                          })
                          break;
                        case 2:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              const queue2Embed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(":clipboard: Queue")
                                .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                .addFields(
                                  { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                  { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false }
                                )
                              message.channel.send(queue2Embed)
                            })
                          })
                          break;
                        case 3:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                const queue3Embed = new Discord.MessageEmbed()
                                  .setColor('#0099ff')
                                  .setTitle(":clipboard: Queue")
                                  .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                  .addFields(
                                    { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                    { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                    { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false }
                                  )
                                message.channel.send(queue3Embed)
                              })
                            })
                          })
                          break;
                        case 4:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  const queue4Embed = new Discord.MessageEmbed()
                                    .setColor('#0099ff')
                                    .setTitle(":clipboard: Queue")
                                    .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                    .addFields(
                                      { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                      { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                      { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                      { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false }
                                    )
                                  message.channel.send(queue4Embed)
                                })
                              })
                            })
                          })
                          break;
                        case 5:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    const queue5Embed = new Discord.MessageEmbed()
                                      .setColor('#0099ff')
                                      .setTitle(":clipboard: Queue")
                                      .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                      .addFields(
                                        { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                        { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                        { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                        { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                        { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false }
                                      )
                                    message.channel.send(queue5Embed)
                                  })
                                })
                              })
                            })
                          })
                          break;
                        case 6:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      const queue6Embed = new Discord.MessageEmbed()
                                        .setColor('#0099ff')
                                        .setTitle(":clipboard: Queue")
                                        .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                        .addFields(
                                          { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                          { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                          { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                          { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                          { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                          { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false }
                                        )
                                      message.channel.send(queue6Embed)
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                        case 7:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      simpleYT(serverQueue.songs[initNum + 6], { filter: "video" }).then(r => {
                                        const result7 = r[0]
                                        const queue7Embed = new Discord.MessageEmbed()
                                          .setColor('#0099ff')
                                          .setTitle(":clipboard: Queue")
                                          .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                          .addFields(
                                            { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                            { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                            { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                            { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                            { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                            { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false },
                                            { name: initNum + 7 + ". " + result7.title, value: result7.length.sec + " seconds", inline: false }
                                          )
                                        message.channel.send(queue7Embed)
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                        case 8:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      simpleYT(serverQueue.songs[initNum + 6], { filter: "video" }).then(r => {
                                        const result7 = r[0]
                                        simpleYT(serverQueue.songs[initNum + 7], { filter: "video" }).then(r => {
                                          const result8 = r[0]
                                          const queue8Embed = new Discord.MessageEmbed()
                                            .setColor('#0099ff')
                                            .setTitle(":clipboard: Queue")
                                            .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                            .addFields(
                                              { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                              { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                              { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                              { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                              { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                              { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false },
                                              { name: initNum + 7 + ". " + result7.title, value: result7.length.sec + " seconds", inline: false },
                                              { name: initNum + 8 + ". " + result8.title, value: result8.length.sec + " seconds", inline: false }
                                            )
                                          message.channel.send(queue8Embed)
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                        case 9:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      simpleYT(serverQueue.songs[initNum + 6], { filter: "video" }).then(r => {
                                        const result7 = r[0]
                                        simpleYT(serverQueue.songs[initNum + 7], { filter: "video" }).then(r => {
                                          const result8 = r[0]
                                          simpleYT(serverQueue.songs[initNum + 8], { filter: "video" }).then(r => {
                                            const result9 = r[0]
                                            const queue9Embed = new Discord.MessageEmbed()
                                              .setColor('#0099ff')
                                              .setTitle(":clipboard: Queue")
                                              .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                              .addFields(
                                                { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                                { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                                { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                                { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                                { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                                { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false },
                                                { name: initNum + 7 + ". " + result7.title, value: result7.length.sec + " seconds", inline: false },
                                                { name: initNum + 8 + ". " + result8.title, value: result8.length.sec + " seconds", inline: false },
                                                { name: initNum + 9 + ". " + result9.title, value: result9.length.sec + " seconds", inline: false }
                                              )
                                            message.channel.send(queue9Embed)
                                          })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                        case 10:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      simpleYT(serverQueue.songs[initNum + 6], { filter: "video" }).then(r => {
                                        const result7 = r[0]
                                        simpleYT(serverQueue.songs[initNum + 7], { filter: "video" }).then(r => {
                                          const result8 = r[0]
                                          simpleYT(serverQueue.songs[initNum + 8], { filter: "video" }).then(r => {
                                            const result9 = r[0]
                                            simpleYT(serverQueue.songs[initNum + 9], { filter: "video" }).then(r => {
                                              const result10 = r[0]
                                              const queue10Embed = new Discord.MessageEmbed()
                                                .setColor('#0099ff')
                                                .setTitle(":clipboard: Queue")
                                                .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                                .addFields(
                                                  { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                                  { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                                  { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                                  { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                                  { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                                  { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false },
                                                  { name: initNum + 7 + ". " + result7.title, value: result7.length.sec + " seconds", inline: false },
                                                  { name: initNum + 8 + ". " + result8.title, value: result8.length.sec + " seconds", inline: false },
                                                  { name: initNum + 9 + ". " + result9.title, value: result9.length.sec + " seconds", inline: false },
                                                  { name: initNum + 10 + ". " + result10.title, value: result10.length.sec + " seconds", inline: false }
                                                )
                                              message.channel.send(queue10Embed)
                                            })
                                          })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                        default:
                          simpleYT(serverQueue.songs[initNum], { filter: "video" }).then(r => {
                            const result1 = r[0]
                            simpleYT(serverQueue.songs[initNum + 1], { filter: "video" }).then(r => {
                              const result2 = r[0]
                              simpleYT(serverQueue.songs[initNum + 2], { filter: "video" }).then(r => {
                                const result3 = r[0]
                                simpleYT(serverQueue.songs[initNum + 3], { filter: "video" }).then(r => {
                                  const result4 = r[0]
                                  simpleYT(serverQueue.songs[initNum + 4], { filter: "video" }).then(r => {
                                    const result5 = r[0]
                                    simpleYT(serverQueue.songs[initNum + 5], { filter: "video" }).then(r => {
                                      const result6 = r[0]
                                      simpleYT(serverQueue.songs[initNum + 6], { filter: "video" }).then(r => {
                                        const result7 = r[0]
                                        simpleYT(serverQueue.songs[initNum + 7], { filter: "video" }).then(r => {
                                          const result8 = r[0]
                                          simpleYT(serverQueue.songs[initNum + 8], { filter: "video" }).then(r => {
                                            const result9 = r[0]
                                            simpleYT(serverQueue.songs[initNum + 9], { filter: "video" }).then(r => {
                                              const result10 = r[0]
                                              const queue10Embed = new Discord.MessageEmbed()
                                                .setColor('#0099ff')
                                                .setTitle(":clipboard: Queue")
                                                .setDescription("**Displaying " + len + "/" + lon + " songs | Page: " + page + "/" + queuePages + "**\nTo change the page use: `" + prefix + "queue <page>`")
                                                .addFields(
                                                  { name: initNum + 1 + ". " + result1.title, value: result1.length.sec + " seconds", inline: true },
                                                  { name: initNum + 2 + ". " + result2.title, value: result2.length.sec + " seconds", inline: false },
                                                  { name: initNum + 3 + ". " + result3.title, value: result3.length.sec + " seconds", inline: false },
                                                  { name: initNum + 4 + ". " + result4.title, value: result4.length.sec + " seconds", inline: false },
                                                  { name: initNum + 5 + ". " + result5.title, value: result5.length.sec + " seconds", inline: false },
                                                  { name: initNum + 6 + ". " + result6.title, value: result6.length.sec + " seconds", inline: false },
                                                  { name: initNum + 7 + ". " + result7.title, value: result7.length.sec + " seconds", inline: false },
                                                  { name: initNum + 8 + ". " + result8.title, value: result8.length.sec + " seconds", inline: false },
                                                  { name: initNum + 9 + ". " + result9.title, value: result9.length.sec + " seconds", inline: false },
                                                  { name: initNum + 10 + ". " + result10.title, value: result10.length.sec + " seconds", inline: false }
                                                )
                                              message.channel.send(queue10Embed)
                                            })
                                          })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                          break;
                      }
                    }
                    let len = serverQueue.songs.length
                    let lon = serverQueue.songs.length

                    let queuePages = 1

                    while (len > 10) {
                      len = len - 10
                      queuePages++
                    }

                    if (!args[1] || args[1] == 1 || isNaN(args[1])) {
                      const loadEmbed = new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(":arrows_counterclockwise: The Queue May Take A Few Seconds To Load")

                      message.channel.send(loadEmbed)
                      list(0, lon, lon, lon, 1, queuePages) //list(initNum, lun, len, lon, page, queuePages)
                    }
                    else if (args[1] < 1) {
                      const invalidEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(":no_entry: The Queue Does Not Have Zero Or A Negative Number Of Pages")

                      message.channel.send(invalidEmbed)
                    }
                    else if (args[1] > queuePages) {
                      const noPagesEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(":no_entry: The Queue Does Not Have So Many Pages")

                      message.channel.send(noPagesEmbed)
                    }
                    else {
                      const loadEmbed = new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(":arrows_counterclockwise: The Queue May Take A Few Seconds To Load")

                      message.channel.send(loadEmbed)

                      const initialNum = 10 * args[1] - 10

                      if (queuePages == args[1]) {
                        list(initialNum, len, len, lon, args[1], queuePages)
                      }
                      else {
                        list(initialNum, 10, 10, lon, args[1], queuePages)
                      }
                    }
                  }
                })
            }
          }
        }//end of if all commands
      }
    })


}) //end of client.on


client.on('message', message => {
  //db.set(message.guild.id, "?").then(() => {})
  if (message.author.bot) return;
  db.get(message.guild.id)
    .then(value => {
      if (!value) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
          || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type === 'dm') {
          return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.permissions) {
          const authorPerms = message.channel.permissionsFor(message.author);
          if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply("you don't have the required permission to use this command");
          }
        }

        if (command.args && !args.length) {
          let reply = `You didn't provide any arguments, ${message.author}!`;

          if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
          }

          return message.channel.send(reply);
        }

        try {
          command.execute(message, args, client);
        } catch (error) {
          console.error(error);
          message.reply('there was an error trying to execute that command!');
        }
      }
      else {
        prefix = value

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
          || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type === 'dm') {
          return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.permissions) {
          const authorPerms = message.channel.permissionsFor(message.author);
          if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply("you don't have the required permission to use this command");
          }
        }

        if (command.args && !args.length) {
          let reply = `You didn't provide any arguments, ${message.author}!`;

          if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
          }

          return message.channel.send(reply);
        }

        try {
          command.execute(message, args, client);
        } catch (error) {
          console.error(error);
          message.reply('there was an error trying to execute that command!');
        }
      }
    })
    .catch(err => {
      console.log(err)
      message.channel.send("ERR")
    })
});

//Web server
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});
server.listen(3000);

//Logins the bot into discord
client.login(token);

// slash stuff

client.on("ready", async () => {

  const commands = await client.api
    .applications(client.user.id)
    .guilds("711875542751641651")
    .commands.get()

  console.log(commands)

  const guildID = "711875542751641651"

  const getApp = (guildID) => {
    const app = client.api.applications(client.user.id)
    if (guildID) {
      app.guilds(guildID)
    }
    return app
  }
/*
  //await getApp("711875542751641651").commands("851909436426420275").delete()
  //await getApp("711875542751641651").commands("853390156039716884").delete()
  //await getApp("711875542751641651").commands("853434666572709888").delete()
  //await getApp("711875542751641651").commands("853731753579380766").delete()*/
})







