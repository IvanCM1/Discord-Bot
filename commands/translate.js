const Discord = require('discord.js');
const translate = require("translate");
translate.engine = "libre"


module.exports = {
    name: 'translate',
    code: "`translate`, ",
    description: 'Translates your message to another language',
    usage: "<language to translate to> <text to translate>",
    args: true,
    aliases: ["t"],
    execute(message, args) {

function tr(input, lang1, lang2) {
translate(input, { from: lang1, to: lang2 }).then(text => {
  message.channel.send(text); // Hola mundo
});
}

tr(args[0], "es", "en")


}}