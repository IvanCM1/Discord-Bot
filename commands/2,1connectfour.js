const Discord = require('discord.js');
module.exports = {
  name: '4row',
  code: "`connectfour`, ",
  description: 'A game of connect 4 to play with a friend!',
  usage: " ",
  aliases: ["connectfour", "connect4", "fourinarow", "4inarow", "cf"],
  execute(message) {

    //CONSTANTES
    var turn = false

    let end = false

    const player1 = message.author

    let player = player1

    const inviteEmbed = new Discord.MessageEmbed()
      .setColor("#7289da")
      .setTitle("Connect Four")
      .setDescription("Click on ✅ to join the game!")
      .setThumbnail("https://i.imgur.com/9AS9wkB.png")
      .setFooter("Press ❌ to cancel the game")

    var casilla = ":blue_square:"
    var amarillo = ":yellow_circle:"
    var rojo = ":red_circle:"

    var altura1 = 6
    var altura2 = 6
    var altura3 = 6
    var altura4 = 6
    var altura5 = 6
    var altura6 = 6
    var altura7 = 6

    var casillas =
      [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n"]

    var numCasillas = casillas.length

    var tablero = []

    function refresh() {
      tablero = casillas[0]

      for (i = 1; i < numCasillas; i++) {
        tablero = tablero + casillas[i]
      }
    }

    refresh()

    function inv() {
      if (casillas[0] !== ":one:" || casillas[1] !== ":two:" || casillas[2] !== ":three:" || casillas[3] !== ":four:" || casillas[4] !== ":five:" || casillas[5] !== ":six:" || casillas[6] !== ":seven:") {
        casillas[0] = ":one:"
        casillas[1] = ":two:"
        casillas[2] = ":three:"
        casillas[3] = ":four:"
        casillas[4] = ":five:"
        casillas[5] = ":six:"
        casillas[6] = ":seven:"
        message.channel.send("```Invalid choice, column full```")
          .then(message => {
            setTimeout(function() { message.delete() }, 10000)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }

    function comprobacion(color) {

      for (i = 8; i < 31; i++) { //Vertical

        let casilla1 = casillas[i]
        let casilla2 = casillas[i + 8]
        let casilla3 = casillas[i + 16]
        let casilla4 = casillas[i + 24]

        if (casilla1 === color && casilla2 === color && casilla3 === color && casilla4 === color) {
          end = true
          console.log("End of game")
        }
      }
      for (i = 8; i < 52; i++) { //Horizontal

        let casilla1 = casillas[i]
        let casilla2 = casillas[i + 1]
        let casilla3 = casillas[i + 2]
        let casilla4 = casillas[i + 3]

        if (casilla1 === color && casilla2 === color && casilla3 === color && casilla4 === color) {
          end = true
          console.log("End of game")
        }
      }
      for (i = 8; i < 28; i++) { //Diagonal abajo derecha

        let casilla1 = casillas[i]
        let casilla2 = casillas[i + 9]
        let casilla3 = casillas[i + 18]
        let casilla4 = casillas[i + 27]

        if (casilla1 === color && casilla2 === color && casilla3 === color && casilla4 === color) {
          end = true
          console.log("End of game")
        }
      }
      for (i = 11; i < 31; i++) { //Diagonal abajo izquierda

        let casilla1 = casillas[i]
        let casilla2 = casillas[i + 7]
        let casilla3 = casillas[i + 14]
        let casilla4 = casillas[i + 21]

        if (casilla1 === color && casilla2 === color && casilla3 === color && casilla4 === color) {
          end = true
          console.log("End of game")
        }
      }
    }

    const filter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && !user.bot //&& user.id !== message.author.id ACTIVAR AL TERMINAR
    }
    let filter2 = (reaction, user) => {
      return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'].includes(reaction.emoji.name) && user === player && !user.bot
    }

    //Invitación a unirse
    message.channel.send(inviteEmbed).then(function(message) {
      message.react('✅')
      message.react('❌')

        .then(() => message.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }))
        .then(collected => {

          const reaction = collected.first()
          const player2 = reaction.users.cache.array()[1]

          switch (reaction.emoji.name) {
            case '✅':
              message.delete()

              //Funcion del juego
              function game(color) {

                if (end === true) {
                  message.channel.send(tablero)
                  if (color == rojo) {
                    player = player2
                    const winEmbed = new Discord.MessageEmbed()
                      .setAuthor("Game finished!")
                      .setTitle(player.username + " wins")
                      .setColor("#FFFF00")
                    message.channel.send(winEmbed)
                  }
                  else if (color == amarillo) {
                    player = player1
                    const winEmbed = new Discord.MessageEmbed()
                      .setAuthor("Game finished!")
                      .setTitle(player.username + " wins")
                      .setColor("#FF0000")
                    message.channel.send(winEmbed)
                  }
                }
                else {
                  message.channel.send(color + " **" + player.username + "**'s turn\n" + tablero)
                    .then(function(message) {

                      message.react("1️⃣")
                      message.react("2️⃣")
                      message.react("3️⃣")
                      message.react("4️⃣")
                      message.react("5️⃣")
                      message.react("6️⃣")
                      message.react("7️⃣")
                        .then(() => message.awaitReactions(filter2, { max: 1, time: 120000, errors: ['time'] }))
                        .then(collected => {

                          const reaction = collected.first();

                          switch (reaction.emoji.name) {
                            case "1️⃣":
                              var posicion = 0 + altura1 * 8
                              altura1 = altura1 - 1
                              casillas[posicion] = color
                              inv()
                              refresh()
                              message.delete()
                              if (turn === false) {
                                comprobacion(rojo)
                                turn = true
                                player = player2
                                game(amarillo)
                              }
                              else if (turn === true) {
                                comprobacion(amarillo)
                                turn = false
                                player = player1
                                game(rojo)
                              }
                              break;

                            case "2️⃣":
                              var posicion = 1 + altura2 * 8
                              altura2 = altura2 - 1
                              casillas[posicion] = color
                              inv()
                              refresh()
                              message.delete()
                              if (turn === false) {
                                turn = true
                                player = player2
                                comprobacion(rojo)
                                game(amarillo)
                              }
                              else if (turn === true) {
                                turn = false
                                player = player1
                                comprobacion(amarillo)
                                game(rojo)
                              }
                              break;

                            case "3️⃣":
                              var posicion = 2 + altura3 * 8
                              altura3 = altura3 - 1
                              casillas[posicion] = color
                              inv()
                              refresh()
                              message.delete()
                              if (turn === false) {
                                turn = true
                                player = player2
                                comprobacion(rojo)
                                game(amarillo)
                              }
                              else if (turn === true) {
                                turn = false
                                player = player1
                                comprobacion(amarillo)
                                game(rojo)
                              }
                              break;

                            case "4️⃣":
                              var posicion = 3 + altura4 * 8
                              altura4 = altura4 - 1
                              casillas[posicion] = color
                              inv()
                              refresh()
                              message.delete()
                              if (turn === false) {
                                turn = true
                                player = player2
                                comprobacion(rojo)
                                game(amarillo)
                              }
                              else if (turn === true) {
                                turn = false
                                player = player1
                                comprobacion(amarillo)
                                game(rojo)
                              }
                              break;

                            case "5️⃣":
                              var posicion = 4 + altura5 * 8
                              altura5 = altura5 - 1
                              casillas[posicion] = color
                              inv()
                              refresh()
                              message.delete()
                              if (turn === false) {
                                turn = true
                                player = player2
                                comprobacion(rojo)
                                game(amarillo)
                              }
                              else if (turn === true) {
                                turn = false
                                player = player1
                                comprobacion(amarillo)
                                game(rojo)
                              }
                              break;

                            case "6️⃣":
                              var posicion = 5 + altura6 * 8
                              altura6 = altura6 - 1
                              casillas[posicion] = color
                              inv()
                              refresh()
                              message.delete()
                              if (turn === false) {
                                turn = true
                                player = player2
                                comprobacion(rojo)
                                game(amarillo)
                              }
                              else if (turn === true) {
                                turn = false
                                player = player1
                                comprobacion(amarillo)
                                game(rojo)
                              }
                              break;

                            case "7️⃣":
                              var posicion = 6 + altura7 * 8
                              altura7 = altura7 - 1
                              casillas[posicion] = color
                              inv()
                              refresh()
                              message.delete()
                              if (turn === false) {
                                turn = true
                                player = player2
                                comprobacion(rojo)
                                game(amarillo)
                              }
                              else if (turn === true) {
                                turn = false
                                player = player1
                                comprobacion(amarillo)
                                game(rojo)
                              }
                              break;
                          } //end of switch
                        }) //collected2

                        .catch(collected => {
                          console.log(collected)
                          message.channel.send('The game was canceled as 2 minutes passed without any interaction');
                        })
                    }) //function 
                }
              }
              //end of functions
              game(rojo)







              break;

            case '❌':
              message.delete()
              message.channel.send('The match was canceled')
              break;
          } //end of invitation switch 
        }) //collected1
        .catch(collected => {
          message.reply('the game was canceled as no-one joined the game');
        })
    })
  }
}