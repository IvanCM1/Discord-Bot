const Discord = require('discord.js');
const search = require('youtube-search');
const opts = {
    maxResults: 1,
    key: process.env.YOUTUBE_API_KEY,
    type: "video"
};
const ytdl = require('ytdl-core');

const queue = new Map()

module.exports = {
  name: "fasdfasdfasdfas",
  code: "`play`, ",
	description: "Plays audio in your current channel",
	usage: " ",
	aliases: [" "],
    execute(message, args) {

message.channel.send("YES")
}}