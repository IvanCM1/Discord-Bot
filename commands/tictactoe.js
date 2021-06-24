const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
    name: 'tictactoe',
    code: "`tictactoe`, ",
    description: "Play tic tac toe!",
    usage: " ",
    aliases: ["ttt"],
    execute(message, args, client) {
    
        // Variables

        let tablero = ["blank", "blank", "blank",
                        "blank", "blank", "blank",
                        "blank", "blank", "blank"]

        let player1 = message.author

        let player = player1

        let x = "❌"

        let o = "⭕"

        let emoji = x

        let end = false

        // Buttons
        let button1 = new MessageButton()
            .setLabel(" ")
            .setStyle("grey")
            .setID("button1")

        let button2 = new MessageButton()
            .setLabel(" ")
            .setStyle("grey")
            .setID("button2")

        let button3 = new MessageButton()
            .setLabel(" ")
            .setStyle("grey")
            .setID("button3")
            
        let button4 = new MessageButton()
            .setLabel(" ")
            .setStyle("grey")
            .setID("button4")

        let button5 = new MessageButton()
            .setLabel(" ")
            .setStyle("grey")
            .setID("button5")

        let button6 = new MessageButton()
            .setLabel(" ")
            .setStyle("grey")
            .setID("button6")

        let button7 = new MessageButton()
            .setLabel(" ")
            .setStyle("grey")
            .setID("button7")

        let button8 = new MessageButton()
            .setLabel(" ")
            .setStyle("grey")
            .setID("button8")

        let button9 = new MessageButton()
            .setLabel(" ")
            .setStyle("grey")
            .setID("button9")

        let row1 = new MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)
            .addComponent(button3)

        let row2 = new MessageActionRow()
            .addComponent(button4)
            .addComponent(button5)
            .addComponent(button6)

        let row3 = new MessageActionRow()
            .addComponent(button7)
            .addComponent(button8)
            .addComponent(button9)

        // Invite

        const inviteEmbed = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setTitle(message.author.username + " wants to play connect four!")
            .setDescription("Click ✅ to join the game!")
            .setThumbnail("https://i.imgur.com/9AS9wkB.png")
            .setFooter("Press 🤖 to play versus the computer or ❌ to cancel the game")
      
        let acceptButton = new MessageButton()
            .setStyle('grey')
            .setLabel('✅')
            .setID("join")
      
        let rejectButton = new MessageButton()
            .setStyle("grey")
            .setLabel("❌")
            .setID("cancel")

        let computer = new MessageButton()
            .setStyle("grey")
            .setLabel("🤖")
            .setID("computer")

        function win() {
            end = true
            console.log("WIN")
        }

        function check(emoji) {
            console.log(tablero)

            if (tablero[0] == tablero[1] == tablero[2]) {
                console.log("win")
                win()
            }
            else if (tablero[3] === tablero[4] === tablero[5] === emoji) {
                win()
            }
            else if (tablero[6] === tablero[7] === tablero[8] === emoji) {
                win()
            }
            else if (tablero[0] === tablero[4] === tablero[8] === emoji) {
                win()
            }
            else if (tablero[2] === tablero[4] === tablero[6] === emoji) {
                win()
            }
            else if (tablero[0] === tablero [3] === tablero[6] === emoji) {
                win()
            }
            else if (tablero[1] === tablero [4] === tablero[7] === emoji) {
                win()
            }
            else if (tablero[2] === tablero [5] === tablero[8] === emoji) {
                win()
            }          
        }
      
          let invi = new MessageActionRow()
            .addComponents(acceptButton, computer, rejectButton)
      
        let m = message.channel.send(' ', { components: [invi], embed: inviteEmbed })
        .then(m => {
            const filter1 = (button) => true

            const collector1 = m.createButtonCollector(filter1, {time: 120000})
  
    collector1.on("collect", button => {

        switch (button.id) {

            case "cancel":
      
                if (button.clicker.user.id === player1.id) {
                  const cancelEmbed = new Discord.MessageEmbed()
                    .setColor("#FF0000")
                    .setTitle("The game has been canceled")
      
                  button.message.delete()
                  button.message.channel.send(cancelEmbed)
                  button.defer()
                }
                else {
                  button.reply.send("You can't cancel a game created by another user", true)
                }
      
            break;
      
            case "join":

                //if (button.clicker.user.id === player1.id) {
                //  button.reply.send("You can't join your own game", true)
                //}
                //else { // Creates game
                  button.defer()
                  button.message.delete()
      
                  let player2 = button.clicker.user

                  let n = button.message.channel.send(emoji + " **" + player.username + "**'s turn", {components: [row1, row2, row3]})
                    .then(n => {
                        const filter2 = (button) => button.clicker.user.id === player.id && end === false

                        const collector2 = n.createButtonCollector(filter2, {time: 120000})

                        collector2.on("collect", b => {
                            switch (b.id) {
                                case "button1":
                                    function move(place, button) {
                                    tablero[place] = emoji
                                    check(emoji)
                                    console.log(end)
                                    button = button
                                    .setDisabled(true)
                                    .setEmoji(emoji)
                                    row1 = new MessageActionRow()
                                    .addComponent(button1)
                                    .addComponent(button2)
                                    .addComponent(button3)
                                    row2 = new MessageActionRow()
                                    .addComponent(button4)
                                    .addComponent(button5)
                                    .addComponent(button6)
                                    row3 = new MessageActionRow()
                                    .addComponent(button7)
                                    .addComponent(button8)
                                    .addComponent(button9)
                                    b.defer()
                                    if (end === true) {
                                        b.message.channel.send(player + " won!")
                                    }
                                    else if (emoji === x) {
                                        emoji = o
                                        player = player2
                                        b.message.edit(emoji + " **" + player.username + "**'s turn", {components: [row1, row2, row3]})
                                    }
                                    else if (emoji === o) {
                                        emoji = x
                                        player = player1
                                        b.message.edit(emoji + " **" + player.username + "**'s turn", {components: [row1, row2, row3]})
                                    }
                                }
                                    move(0, button1)

                                break;

                                case "button2":
                                    move(1, button2)
                                break;

                                case "button3":
                                    move(2, button3)
                                break; 

                                case "button4":
                                    move(3, button4)
                                break;

                                case "button5":
                                    move(4, button5)
                                break;

                                case "button6":
                                    move(5, button6)
                                break;

                                case "button7":
                                    move(6, button7)
                                break; 

                                case "button8":
                                    move(7, button8)
                                break;

                                case "button9":
                                    move(8, button9)
                                break;
                            }

                        })
                    })
                //}
            break;

            case "computer":
            button.defer()

            break;
            }
    })

        })


    }}