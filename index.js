const envvar = require('envvar');
const fs = require('fs');
const Discord = require('discord.js');
const db = require('quick.db');
const token = envvar.string("CLIENT_TOKEN")
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
/*
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

client.on('message', message => {
  if (message.author.bot) return;
  let mention = message.mentions.users.first()
  let botID = client.user.id

  if (typeof mention === "undefined") {

  }

  else if (mention.id == botID) {
    const data = []
    const { commands } = message.client
    let value = db.get(message.guild.id)
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
  }
})


client.on('message', message => {
  //db.set(message.guild.id, "?").then(() => {})
  if (message.author.bot) return;
  let value = db.get(message.guild.id)
 
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
});
*/
//Web server
/*const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});
server.listen(3000)*/

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







