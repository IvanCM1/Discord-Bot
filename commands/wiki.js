const Discord = require('discord.js');
const wiki = require('wikipedia');
const opts = {
  limit: 1
}

module.exports = {
    name: 'wikipedia',
    code: "`wikipedia`, ",
    description: 'Displays the wikipedia info about something',
    usage: "<title of page>",
    args: true,
    aliases: ["wiki"],
    execute(message, args) {

let text = args[0]

for (i = 1; i < args.length; i++) {
  text = text + " " + args[i]
}

wiki.search(text, opts).then(result => {
  const pageID = result.results[0].pageid

wiki.page(pageID).then(res => {
    res.summary().then(r => {

      if (!r.description) {
    const wikiEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(r.displaytitle)
    .setURL(r.content_urls.desktop.page)
    .setDescription(r.extract)
    .setImage(r.originalimage.source)

    message.channel.send(wikiEmbed)
      }
      else {
    const wikiEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setAuthor(r.description)
    .setTitle(r.displaytitle)
    .setURL(r.content_urls.desktop.page)
    .setDescription(r.extract)
    .setImage(r.originalimage.source)

    message.channel.send(wikiEmbed)
      }
})
})
.catch(err => { 
console.log(err)
message.channel.send("There was an error finding that page, maybe it doesn't exist")
})
})




}}