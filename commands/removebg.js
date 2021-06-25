const Discord = require('discord.js');
var request = require('request');
var fs = require('fs');
const APIkey = process.env.API_KEY
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
      if (error) return console.error('Request failed:', error);
      if (response.statusCode != 200) {
        console.error('Error:', response.statusCode, body.toString('utf8'))
        message.channel.send("**There was an error removing the background from that image, this could be because:**\n- The background couldn't be detected in this image\n- The image already has no background\n- The link must link to an image\n- This bot can only remove 50 backgrounds a month");
      }
      else if (response.statusCode == 200) {
        
        fs.writeFileSync("no-bg.png", body);

        message.channel.send("Your image:", { files: ["./no-bg.png"] })
      }

    })
  }
}