const Discord = require('discord.js');
const Canvas = require('canvas');
const ColorThief = require('colorthief');

module.exports = {
  name: 'canva',
  code: "`canva`, ",
  description: "Canvas test",
  usage: "<smth>",
  args: false,
  aliases: [" "],
  execute(message, args) {

    const canvas = Canvas.createCanvas(1024, 500);
    const ctx = canvas.getContext('2d');


      //Texto

      let text = "Welcome to the server"   //añadir otro texto debajo con el nombre del miembro

      Canvas.registerFont('uni-sans.heavy-caps.otf', { family: 'uni sans' })

      ctx.textAlign = "center";
	    ctx.fillStyle = '#ffffff';
	  
      let fontSize = 70

      let adj = canvas.width / 1.25

      let textLength = ctx.measureText(text).width

      do {
        fontSize = fontSize - 1
        ctx.font = fontSize + "px uni sans"
        textLength = ctx.measureText(text).width

      }
      while (textLength > adj)

      ctx.fillText(text, canvas.width/2, canvas.height * 0.75);

      //Avatar
      let x = canvas.width/2
      let y = canvas.height/3
      let r = 125

	    ctx.beginPath();
	    ctx.arc(x, y, r, 0, Math.PI * 2, true);
	    ctx.closePath();
	    ctx.clip();

      let avatar = message.author.displayAvatarURL({format: "png", dynamic: true})

	    Canvas.loadImage(avatar).then(avatar => {
	    ctx.drawImage(avatar, x - r, y - r, 2*r, 2*r);

      //Dibujos

      ColorThief.getColor(avatar)
        .then(color => {
          console.log(color)

	    ctx.beginPath();
	    ctx.arc(x, y, r, 0, Math.PI * 2, true);
      ctx.lineWidth = 20;
      ctx.strokeStyle = "pink";
	    ctx.stroke();

        })
        .catch(err => { console.log(err) })

      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

      message.channel.send("Welcome to the server!", attachment);
      })

  }
}
