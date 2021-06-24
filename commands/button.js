const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
  name: 'button',
  code: "`button`, ",
  description: "button",
  usage: " ",
  aliases: [" "],
  execute(message, args, client) {

    // Buttons or smth idk

    const but1 = new MessageButton()
      .setStyle("blurple")
      .setLabel("1️")
      .setID("but1")

    const but2 = new MessageButton()
      .setStyle("blurple")
      .setLabel("2️")
      .setID("but2")

    const but3 = new MessageButton()
      .setStyle("blurple")
      .setLabel("3️")
      .setID("but3")

    const but4 = new MessageButton()
      .setStyle("blurple")
      .setLabel("4️")
      .setID("but4")

    const but5 = new MessageButton()
      .setStyle("blurple")
      .setLabel("5️")
      .setID("but5")

    const but6 = new MessageButton()
      .setStyle("blurple")
      .setLabel("6️")
      .setID("but6")

    const but7 = new MessageButton()
      .setStyle("blurple")
      .setLabel("7️")
      .setID("but7")

    const grayBut = new MessageButton()
      .setStyle("gray")
      .setLabel(" ")
      .setID("grayBut")
      .setDisabled()

    // Variables

    let turn = false

    let end = false

    const player1 = message.author

    let player = player1

    var casilla = ":blue_square:"
    var amarillo = ":yellow_circle:"
    var rojo = ":red_circle:"

    let color = rojo

    var altura1 = 6
    var altura2 = 6
    var altura3 = 6
    var altura4 = 6
    var altura5 = 6
    var altura6 = 6
    var altura7 = 6

    var casillasInicial =
      [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n",
        casilla, casilla, casilla, casilla, casilla, casilla, casilla, "\n"]

    let casillas = casillasInicial

    var numCasillas = casillas.length

    var tablero = []

    // Functions


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
        }
      }
      for (i = 8; i < 52; i++) { //Horizontal

        let casilla1 = casillas[i]
        let casilla2 = casillas[i + 1]
        let casilla3 = casillas[i + 2]
        let casilla4 = casillas[i + 3]

        if (casilla1 === color && casilla2 === color && casilla3 === color && casilla4 === color) {
          end = true
        }
      }
      for (i = 8; i < 28; i++) { //Diagonal abajo derecha

        let casilla1 = casillas[i]
        let casilla2 = casillas[i + 9]
        let casilla3 = casillas[i + 18]
        let casilla4 = casillas[i + 27]

        if (casilla1 === color && casilla2 === color && casilla3 === color && casilla4 === color) {
          end = true
        }
      }
      for (i = 11; i < 31; i++) { //Diagonal abajo izquierda

        let casilla1 = casillas[i]
        let casilla2 = casillas[i + 7]
        let casilla3 = casillas[i + 14]
        let casilla4 = casillas[i + 21]

        if (casilla1 === color && casilla2 === color && casilla3 === color && casilla4 === color) {
          end = true
        }
      }
    }

    // Invite

    const inviteEmbed = new Discord.MessageEmbed()
      .setColor("#7289DA")
      .setTitle(message.author.username + " wants to play connect four!")
      .setDescription("Click on ✅ to join the game!")
      .setThumbnail("https://i.imgur.com/9AS9wkB.png")
      .setFooter("Press ❌ to cancel the game")

    let acceptButton = new MessageButton()
      .setStyle('green')
      .setLabel('✅ Join')
      .setID("join")

    let rejectButton = new MessageButton()
      .setStyle("red")
      .setLabel("❌ Cancel")
      .setID("cancel")

    let invi = new MessageActionRow()
      .addComponents(acceptButton, rejectButton)

    message.channel.send(' ', { components: [invi], embed: inviteEmbed });

    // Buttons 

    client.on("clickButton", button => {
      button.defer()

      switch (button.id) {

        case "cancel":

          if (button.clicker.user.id === player1.id) {
            const cancelEmbed = new Discord.MessageEmbed()
              .setColor("#FF0000")
              .setTitle("The game has been canceled")

            button.message.delete()
            button.message.channel.send(cancelEmbed)
          }
          else {
            button.reply.send("You can't cancel a game created by another user", true)
          }

          break;

        case "join":
          if (button.clicker.user.id === player1.id) {
            button.reply.send("You can't join your own game", true)
          }
          else {
            // Create game 
            // Connect four
            button.message.delete()

            let player2 = button.clicker.user

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
                  end = false
                  casillas = casillasInicial
                  refresh()
                }
                else if (color == amarillo) {
                  player = player1
                  const winEmbed = new Discord.MessageEmbed()
                    .setAuthor("Game finished!")
                    .setTitle(player.username + " wins")
                    .setColor("#FF0000")
                  message.channel.send(winEmbed)
                  end = false
                  casillas = casillasInicial
                  refresh()
                }
              }
              else {
                //botones numeros

                let row1 = new MessageActionRow()
                  .addComponents([but1, but2, but3, but4, but5])

                let row2 = new MessageActionRow()
                  .addComponents([grayBut, grayBut, grayBut, but6, but7])

                let m = button.channel.send(color + " **" + player.username + "**'s turn\n" + tablero, { components: [row1, row2] })
                  .then(m => {
                    const filter = (button) => button.clicker.user.id === player.id
                    const collector = m.createButtonCollector(filter, { time: 120000 });

                    collector.on('collect', b => {
                      switch (b.id) {
                        case "but1":
                          var posicion = 0 + altura1 * 8
                          altura1 = altura1 - 1
                          casillas[posicion] = color
                          inv()
                          refresh()
                          b.message.delete()
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

                        case "but2":
                          var posicion = 1 + altura2 * 8
                          altura2 = altura2 - 1
                          casillas[posicion] = color
                          inv()
                          refresh()
                          b.message.delete()
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

                        case "but3":
                          var posicion = 2 + altura3 * 8
                          altura3 = altura3 - 1
                          casillas[posicion] = color
                          inv()
                          refresh()
                          b.message.delete()
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
                        case "but4":
                          var posicion = 3 + altura4 * 8
                          altura4 = altura4 - 1
                          casillas[posicion] = color
                          inv()
                          refresh()
                          b.message.delete()
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
                        case "but5":
                          var posicion = 4 + altura5 * 8
                          altura5 = altura5 - 1
                          casillas[posicion] = color
                          inv()
                          refresh()
                          b.message.delete()
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
                        case "but6":
                          var posicion = 5 + altura6 * 8
                          altura6 = altura6 - 1
                          casillas[posicion] = color
                          inv()
                          refresh()
                          b.message.delete()
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
                        case "but7":
                          var posicion = 6 + altura7 * 8
                          altura7 = altura7 - 1
                          casillas[posicion] = color
                          inv()
                          refresh()
                          b.message.delete()
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
                      }
                    });
                    collector.on('end', collected => {
                      if (collected.size < 1) {
                        m.delete()
                        m.channel.send("Game canceled as 2 minutes passed without any interaction")
                      }
                    });
                  })
                  .catch(err => console.log(err))

              }
            }

            game(rojo)
            //}

            break;
          }


      }})




    }}