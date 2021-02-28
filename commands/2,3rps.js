const Discord = require('discord.js');
module.exports = {
	name: 'rps',
  code: "`rps`, ",
	description: 'Plays rock paper scissors with you!',
	usage: "<paper, rock or scissors>",
	args: true,
	aliases: [" "],
	execute(message, args) {
		//Election
		var elections = ["rock", "paper", "scissors"]
        var randomElection = Math.floor(Math.random() * elections.length)
		var election = elections[randomElection]
		//Response Embed
		function embed(WEL) {
		const rpsEmbed = new Discord.MessageEmbed()
			.setColor("FFFFFF")
			.setTitle(WEL)
			.setThumbnail("https://i.ibb.co/Ks1jDmS/gVEmgaG.png")
			.addFields(
				{name: "*I chose:*", value: "`" + election + "`", inline: true},
				{name: "*You chose:*", value: "`" + args[0] + "`", inline: true}
			)
		message.channel.send(rpsEmbed)
		}
		//Empate
		if (election == args[0]) {
			embed("We are even!")
		}
		//Perder
		else if (args[0] == elections[0] & election === elections[1]) {
			embed("You lose!")
		}
		else if (args[0] == elections[1] & election === elections[2]) {
			embed("You lose!")
		}
		else if (args[0] == elections[2] & election === elections[0]) {
			embed("You lose!")
		}
		//Ganar
		else if (args[0] == elections[1] & election === elections[0]) {
			embed("You win!")
		}
		else if (args[0] == elections[2] & election === elections[1]) {
			embed("You win!")
		}
		else if (args[0] == elections[0] & election === elections[2]) {
			embed("You win!")
		}
}}