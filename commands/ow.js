const Discord = require('discord.js');
const ow = require('overwatch-stats-api');
const ColorThief = require('colorthief');
const db = require("quick.db")

module.exports = {
  name: 'ow',
  code: "`overwatch`",
  description: 'Displays overwatch info in your profile',
  usage: "<BattleTag> <Platform>",
  aliases: ["overwatch"],
	execute(message, args) {

      function stat(stats) {
      ColorThief.getColor(stats.iconURL)
        .then(color => {

      let level = stats.prestige * 100 

      for (i = 0; i < stats.level; i++) {
        level++
      }

      console.log(stats.heroStats.competitive.overall)

      let statEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(stats.battletag.replace("-", "#") + " - Lvl. " + level)
      .setDescription("Endorsement level: " + stats.endorsementLevel)
      .setThumbnail(stats.iconURL)
      .setURL(stats.profileURL)
      .addFields(
        {name: "Games played", value: stats.heroStats.quickplay.overall.game.games_played, inline: true},
        {name: "Games won", value: stats.heroStats.quickplay.overall.game.games_won, inline: true},
        {name: "Games lost", value: stats.heroStats.quickplay.overall.game.games_lost, inline: true},
        {name: "Time played", value: stats.heroStats.quickplay.overall.game.time_played, inline: false},
                


        {name: "Shotcaller", value: stats.endorsements.shotcaller + "%", inline: true},
        {name: "Teammate", value: stats.endorsements.teammate + "%", inline: true},
        {name: "Sportmanship", value: stats.endorsements.sportsmanship + "%", inline: true}
      )

      

      
      

      if (stats.rank.tank && stats.rank.support && stats.rank.damage) {
        statEmbed
        .addField(":shield: Tank SR", stats.rank.tank.sr, true)
        .addField(":pill: Support SR", stats.rank.support.sr, true)
        .addField(":crossed_swords: Damage SR", stats.rank.damage.sr, true)
        message.channel.send(statEmbed)
      }
      else if (stats.rank.tank && stats.rank.support && !stats.rank.damage) {
        statEmbed
        .addField(":shield: Tank SR", stats.rank.tank.sr, true)
        .addField(":pill: Support SR", stats.rank.support.sr, true)
        .addField("\u200B", "\u200B", true)
        message.channel.send(statEmbed)
      }
      else if (stats.rank.tank && !stats.rank.support && stats.rank.damage) {
        statEmbed
        .addField(":shield: Tank SR", stats.rank.tank.sr, true)
        .addField("\u200B", "\u200B", true)
        .addField(":crossed_swords: Damage SR", stats.rank.damage.sr, true)
        message.channel.send(statEmbed)
      }
      else if (!stats.rank.tank && stats.rank.support && stats.rank.damage) {
        statEmbed
        .addField("\u200B", "\u200B", true)
        .addField(":pill: Support SR", stats.rank.support.sr, true)
        .addField(":crossed_swords: Damage SR", stats.rank.damage.sr, true)
        message.channel.send(statEmbed)
      }
      else if (stats.rank.tank && !stats.rank.support && !stats.rank.damage) {
        statEmbed
        .addField(":shield: Tank SR", stats.rank.tank.sr, true)
        .addField("\u200B", "\u200B", true)
        .addField("\u200B", "\u200B", true)
        message.channel.send(statEmbed)
      }
      else if (!stats.rank.tank && stats.rank.support && !stats.rank.damage) {
        statEmbed
        .addField("\u200B", "\u200B", true)
        .addField(":pill: Support SR", stats.rank.support.sr, true)
        .addField("\u200B", "\u200B", true)
        message.channel.send(statEmbed)
      }
      else if (!stats.rank.tank && !stats.rank.support && stats.rank.damage) {
        statEmbed
        .addField("\u200B", "\u200B", true)
        .addField("\u200B", "\u200B", true)
        .addField(":crossed_swords: Damage SR", stats.rank.damage.sr, true)
        message.channel.send(statEmbed)
      }
      else if (!stats.rank.tank && !stats.rank.support && !stats.rank.damage) {
        message.channel.send(statEmbed)
      }
      else {
        message.channel.send("An error ocurred")
      }


      console.log(stats)
    })
      }

  if (!args[0]) {
    const value = db.get("ow" + message.author.id)
          ow.getAllStats(value.battletag, value.platform)
          .then(stats => {
            stat(stats)
          console.log(stats)
          })
          .catch(err => {
          console.log(err)
          })
        .catch(err => {
          message.channel.send("No BattleTag provided or profile saved")
          console.log(err)
        })
  }
  else if (args[1] !== "pc" && args[1] !== "xbl" && args[1] !== "psn"){
     message.channel.send("incorrect region")
     //enviar correct platforms
  }
  else {
    let tag = args[0].replace("#", "-")
    let platform = args[1]

    ow.getAllStats(tag, platform)
    .then(stats => {

      let profile = {
        battletag: tag,
        platform: platform
      }

      db.set("ow" + message.author.id, profile)

      stat(stats)
    })
    .catch(err => {
      console.log(err)
    })



    message.channel.send(":repeat: Results May Take A Few Seconds To Load")
  }



  }}