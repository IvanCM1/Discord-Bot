const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  name: 'canva',
  code: "`canva`, ",
  description: "Canvas test",
  usage: "<smth>",
  args: false,
  aliases: [" "],
  execute(message, args) {

    const canvas = Canvas.createCanvas(600, 300);
    const ctx = canvas.getContext('2d');

    Canvas.loadImage('https://discordjs.guide/assets/img/canvas-preview.cced9193.png').then(background => {

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      	ctx.strokeStyle = '#74037b';
      	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	    ctx.beginPath();
	    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	    ctx.closePath();
	    ctx.clip();

	    Canvas.loadImage(message.author.displayAvatarURL({ format: 'png' })).then(avatar => {
	    ctx.drawImage(avatar, 25, 25, 200, 200);


      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

      message.channel.send(`Welcome to the server!`, attachment);
      })
    })


  }
}