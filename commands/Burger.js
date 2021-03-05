const embeds = require(`../Embeds.js`);

exports.headers =
{
    name: `Burger`,
    aliases: [`burger`],
    desc: `A burger a day keeps the doctor away!`,
    category: `fun`,
    usage: `/burger <user>`
};

exports.run = (client, message, args) =>
{
    var senderName = message.author.username;
    var user = message.mentions.users.first();
		
	if(message.mentions.users.size < 1)
	{ 
        let botembed = embeds.getBurgerSelf(senderName);
        return message.channel.send(botembed);
	} else {
		let botembed = embeds.getBurgerFeed(senderName, user.username);
		return message.channel.send(botembed);		
	}
}