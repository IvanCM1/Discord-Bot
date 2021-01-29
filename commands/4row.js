const Discord = require('discord.js');
module.exports = {
	name: '4row',
	description: 'A game of connect 4 for you and a friend!',
	usage: " ",
	aliases: ["connectfour", "connect4", "fourinarow", "4inarow"],
	execute(message) {

    //CONSTANTES


var end = false

const player1 = message.author.id

const InviteEmbed = new Discord.MessageEmbed()
    .setTitle("Connect Four")
    .setDescription("Click on ✅ to join the game!")
    .setThumbnail("https://i.imgur.com/9AS9wkB.png")
    .setFooter("Press ❌ to cancel the game")

var casilla = ":blue_square:"
var amarillo = ":yellow_circle:"
var rojo = ":red_circle"

var casillas = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:" , "\n",
                casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
                casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
                casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
                casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
                casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
                casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n"]

var numCasillas = casillas.length
var tablero = casillas[0]

function send() {
    message.channel.send(tablero).then(function(message) {
        message.react("1️⃣")
        message.react("2️⃣")
        message.react("3️⃣")
        message.react("4️⃣")
        message.react("5️⃣")
        message.react("6️⃣")
        message.react("7️⃣")
    })
}
const filter = (reaction, user) => {
    return ['✅', '❌'].includes(reaction.emoji.name) && !user.bot //&& user.id !== message.author.id ACTIVAR AL TERMINAR
}
    //Invitación a unirse
message.channel.send(InviteEmbed).then(function(message) {
    message.react('✅')
    message.react('❌')

.then(() => message.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }))
	.then(collected => {
    
    const reaction = collected.first();
    Discord.ReactionUserManager

    switch (reaction.emoji.name) {
        case '✅':

            message.delete()
            send()
            message.channel.send(player1 + "\n" + player2)
                   
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
            break;
        case '❌':
            message.delete()
            message.channel.send('The match was canceled')
        break;
    }
})
	.catch(collected => {
		message.reply('the game was canceled as no-one joined the game');
	});
})



//Es necesario que solo pueda responder el jugador de cada turno


for (i=1; i < numCasillas; i++) {
    tablero = tablero + casillas[i]
}






//Se recibe la reaccion

//Se coloca la ficha donde corresponde



var turno = true    //true es primer jugador/red, false es segundo jugador/yellow
var columnas = 8

function comprobacion(color) {  //DESPUES DE CADA TURNO
    for (i=columnas; i <= numCasillas - 4*columnas; i++) {

        casilla1 = tablero[i]
        casilla2 = tablero[i + 2*columnas]
        casilla3 = tablero[i + 3*columnas]
        casilla4 = tablero[i + 4*columnas]

        if(casilla1 == casilla2 && casilla2 == casilla3 && casilla3 == casilla4 && casilla1 != casilla && casilla1 == color) {
            end = true
        }
    }
}


}}