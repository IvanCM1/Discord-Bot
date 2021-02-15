const Discord = require('discord.js');
var request = require('request');
var fs = require('fs');
const APIkey = process.env.API_KEY
const url = require('url');
module.exports = {
    name: 'removebg',
    code: "`remove`, ",
    description: "Removes the background for a given image",
    usage: "<url of the image>",
    args: true,
    aliases: [" "],
	  execute(message, args) {

const img = args[0]

request.post({
  url: 'https://api.remove.bg/v1.0/removebg',
  formData: {
    image_url: img,
    size: 'auto',
  },
  headers: {
    'X-Api-Key': APIkey
  },
  encoding: null
}, function(error, response, body) {
  if(error) return console.error('Request failed:', error);
  if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
  fs.writeFileSync("no-bg.png", body);

  message.channel.send("Your image:", {files: ["./no-bg.png"]})
})
}}