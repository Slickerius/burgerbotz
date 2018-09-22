const Discord = require('discord.js');

function randomize(min, max) 
{
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = 
{
	post: function(channel, arg) 
	{
        	if(arg.length > 1)
		{
			return channel.send(arg);
		} else {
			return channel.send("Correct usage: /post <message>");
		}
	},
	
	rape: function(channel, message, arr)
	{
		if(message.mentions.users.size < 1)
		{
			return message.reply("please specify a user to *rape*!");
		} else {
			let x = randomize(0, arr.length);

			let botembed = new Discord.RichEmbed()
			.setImage(arr[x])
			.setDescription(`**${message.mentions.users.first().username}** has been brutally sodomized by **${message.author.username}**`)
			.setColor("#fcc66a");
				
			return message.channel.send(botembed);
		}
	}
};
