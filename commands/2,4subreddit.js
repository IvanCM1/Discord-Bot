const Discord = require('discord.js');
const { Submission } = require('snoowrap');
const snoowrap = require('snoowrap');
module.exports = {
  name: 'subreddit',
  code: "`subreddit`, ",
  description: 'Provides an image for a given subreddit',
  usage: "<subreddit>",
  args: true,
  aliases: ["reddit", "r"],
	execute(message, args) {
        //Authenticates to the reddit bot
        const r = new snoowrap({
            userAgent: 'justsomeluciomain',
            clientId: 'e3LHFoy81Liiwg',
            clientSecret: 'ufnacK3uokxvXUYvamSMp4p6nSxj3Q',
            refreshToken: '306992643071-Peqi7X-guOKj38NbkFqOYZK3flGUpg'
          });
        //Submission
        r.getSubreddit(args[0]).getHot().then(submission => {
            var RandomPost = Math.floor(Math.random() * submission.length) + 2
            var post = submission[RandomPost]
            const RedditEmbed = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setTitle(post.title)
              .setURL("http://reddit.com" + post.permalink)
		        	.setImage(post.url)
			        .setFooter("🔥 " + post.ups + " | 💬 " + post.num_comments)
      	  	message.channel.send(RedditEmbed)
        })        
}};