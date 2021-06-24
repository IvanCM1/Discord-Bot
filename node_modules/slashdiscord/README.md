# slashdiscord
Easily create, delete, and manage slash commands with SlashDiscord!

## Methods
### createCommand
obj = the object to post to Discord

### deleteCommand
cmd = the command's name or id

### quickCreateCommand
name = the command name
description = the command description

### sendMessage
d = the data from the packet
msg = text message content
embeds = array of embeds to send
tts = whether to use text to speech or not
allowedMentions = allowed mentions

### fetchCommand
cmd = the command's name, the command's id, or `*` for all



## Example usage:
```js
const Discord = require('discord.js');
const client = new Discord.Client();
const slashDiscord = require('slashdiscord');
const slash = new slashDiscord(client);

var obj = {
    name: "help", 
    description: "Get help on SlashDiscord's slash commands",
    options: [
        {
            name: "command",
            description: "More details on a command",
            type: 3 ,
            required: false
        }
    ]
}
slash.createCommand(obj).then(res => {console.log(res)}); // creates the help command

slash.deleteCommand("help"); // deletes the help command

slash.quickCreateCommand("help", "Get help on SlashDiscord's slash commands").then(res => console.log(res)); // creates the help command, but with no options

client.on("raw", packet => {
    if (packet.t !== "INTERACTION_CREATE") return;
    var embed = new Discord.MessageEmbed().setTitle("Hello");
    var anotherEmbed = new Discord.MessageEmbed().setTitle("World");
    slash.sendMessage(packet.d, {msg: "Hey!", embeds: [embed, anotherEmbed]}); // responds to the interaction with a message
});

slash.fetchCommand("*").then(res => console.log(res)) // gets and console logs all commands
slash.fetchCommand("help").then(res => console.log(res)) // gets and console logs only the help command
```
