const Discord = require('discord.js');
const rd = require("redditdata")

let opts = {
  limit: 50,
  stickies: false,
  videos: false,
  nsfw: true,
  spoiler: true,
  onlyAwarded: true,
  minScore: 1000
}

module.exports = {
  name: 'meme',
  code: "`meme`, ",
  description: 'A fresh meme from Reddit!',
  usage: "",
  aliases: ["memes"],
	async execute (message) {
 
        //Selects a random subreddit
        let subreddits = ["memes", "dankmemes", "wholesomememes", "historymemes", "me_irl"]
        let randomSubreddit = Math.floor(Math.random() * subreddits.length)
        let subreddit = subreddits[randomSubreddit]
        //Submission

        let hotPosts = await rd.getSubreddit(subreddit, opts)
        let randomPost = Math.floor(Math.random() * hotPosts.length)
        let post = hotPosts[randomPost]

        let upvotes = Math.round(post.ups/1000)

            const MemeEmbed = new Discord.MessageEmbed()
              .setColor("RANDOM")
              //.setAuthor(`u/${post.author}`, "", `https://www.reddit.com/u/${post.author}`)
              .setTitle(post.title)
              .setURL("http://reddit.com" + post.permalink)
		        	.setImage(post.url)
			        .setFooter("🔥 " + upvotes + "k | 💬 " + post.num_comments + " | u/" + post.author)
      	  	message.channel.send(MemeEmbed)
}};