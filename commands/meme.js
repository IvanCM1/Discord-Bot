const Discord = require('discord.js');
const { Submission } = require('snoowrap');
const snoowrap = require('snoowrap');
module.exports = {
  name: 'meme',
  description: 'A fresh meme from Reddit!',
  usage: "",
  aliases: ["memes"],
	execute(message) {
        //Authenticates to the reddit bot
        const r = new snoowrap({
            userAgent: 'justsomeluciomain',
            clientId: 'e3LHFoy81Liiwg',
            clientSecret: 'ufnacK3uokxvXUYvamSMp4p6nSxj3Q',
            refreshToken: '306992643071-Peqi7X-guOKj38NbkFqOYZK3flGUpg'
          });
        //Selects a random subreddit
        var subreddits = ["memes", "dankmemes"]
        var RandomSubreddit = Math.floor(Math.random() * subreddits.length)
        var subreddit = subreddits[RandomSubreddit]
        //Submission
        r.getSubreddit(subreddit).getHot().then(submission => {
            var hotPosts = submission.length - 2
            var RandomPost = Math.floor(Math.random() * hotPosts) + 2
            var post = submission[RandomPost]
            var upvotes = Math.round(post.ups/1000)
            const MemeEmbed = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setTitle(post.title)
              .setURL("http://reddit.com" + post.permalink)
		        	.setImage(post.url)
			        .setFooter("🔥 " + upvotes + "k | 💬 " + post.num_comments + " | r/" + subreddit)
      	  	message.channel.send(MemeEmbed)
        })        
}};