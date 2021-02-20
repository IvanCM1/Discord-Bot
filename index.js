const fs = require('fs');
const Discord = require('discord.js');
const search = require('youtube-search');

const opts = {
  maxResults: 1,
  key: process.env.YOUTUBE_API_KEY,
  type: "video"
};
const ytdl = require('ytdl-core');
const ownerID = process.env.OWNER_ID
const token = process.env.CLIENT_TOKEN
const prefix = "?"
const queue = new Map()

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity('?help', { type: 'PLAYING' });
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

//MUSIC COMMANDS    
client.on('message', message => {
  if (message.author.bot) return;

  var msg = message.content.toLowerCase()
  const args = message.content.trim().split(/ +/);
  const cmnd = args[0]

  if (cmnd === "?play" || cmnd === "?stop" || cmnd === "?skip" || cmnd === "?leave" || cmnd === "?disconnect") {

    const serverQueue = queue.get(message.guild.id)



      var song = args[1]
      var lu = args.length - 1
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
            search(song, opts, function(err, results) {
              if (err) return console.log(err) & message.channel.send("There was an error with the Youtube API\n*This bot may have run out of free searches*\nUse a youtube link instead")
              let result = results[0]
              songQueue.voiceChannel.join()
                .then(connection => {

                  const stream = ytdl(result.link, { filter: 'audioonly' });

                  const dispatcher = connection.play(stream, { volume: 0.5 })

                  dispatcher.on('start', () => {
                    message.channel.send(result.title + ' is now playing!');

                  });
                  dispatcher.on('finish', () => {
                    songQueue.songs.shift()
                    player(guild, songQueue.songs[0])
                    message.channel.send(result.title + ' has finished playing!');
                  });
                })//end
            })//end of search function 
        }//end of else
      }//end of function player
    //?play
    if (cmnd === "?play") {
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
        message.channel.send("Song added to the queue")
      }
    }//end of ?play          //?stop
    else if (cmnd === "?stop" || cmnd === "?leave" || cmnd === "?disconnect") {
      serverQueue.songs = []
      serverQueue.voiceChannel.leave()
      queue.delete(message.guild.id)

      message.channel.send("Music stopped and queue cleared!")
    }
    else if (cmnd === "?skip") {

      if (!serverQueue || serverQueue.songs.length < 2) {
        message.channel.send("There are no songs waiting in queue")
      }
      else {
        const songQueue = queue.get(message.guild.id)
        songQueue.songs.shift()
        player(message.guild, songQueue.songs[0])
        message.channel.send("Song skipped")
      }
    }
  }//end of if all commands
}) //end of client.on


client.on('message', message => {
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
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
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