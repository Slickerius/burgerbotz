const Discord = require('discord.js');
const fs = require('fs');
const unst = require('./storage/unstatics.js');

module.exports = {flags, burger, rape, help};

var database = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
var commands = unst.commandMap;
		 
var commandNames = Array.from(commands.keys());
for(var x of commandNames)
{
	var y = x;
	var l = 15 - y.length;
	if(y.length < 15)
	{
		 for(i = 0; i < l; i++)
		 {
			y += " ";
		 }
		
		 commands.set(y, commands.get(x));
		 commands.delete(x);
	}		 
}

function randomize(min, max) 
{
	return Math.floor(Math.random() * (max - min)) + min;
}

function calcErr(channel)
{
	channel.send("Usage: /calc <operand 1> <operator> <operand 2>\nExample:/calc 2 + 3\nSupported operators: +, -, *, /, ^");
}

function calcRes(channel, x, y, operator, res)
{
	channel.send("__**Calculated expression:**__ **" + x + " " + operator + " " + " = " + res + "**");	
}

module.exports = 
{
	help: function(channel)
	{
		var commands0 = Array.from(commands.keys());
		commands0.sort();
		var helpTab = "```"
		 
		var i = 0;
		for(var x of commands0)
		{
			helpTab += commands0[i] + "- " + commands.get(commands0[i]) + "\n";  
			i += 1;
		}
		helpTab += "```";
		return channel.send(helpTab);
	},
		 
	post: function(channel, arg) 
	{
        	if(arg.length > 1)
		{
			return channel.send(arg);
		} else {
			return channel.send("Correct usage: /post <message>");
		}
	},
	
	calc: function(channel, x, operator, y) 
	{
		operator.toLowerCase();
		var dx, dy, z;
		if(parseInt(x) == x && parseInt(y) == y)
		{
			calcErr(channel);
		} else {
			dx = parseInt(x);
			dy = parseInt(y);
		}
		console.log(dx, operator, dy);
        	switch(operator)
		{
			case "+":
				z = dx + dy;
				return calcRes(channel, dx, operator, dy, z);
				break;
			case "-":
				z = dx - dy;
				return calcRes(channel, dx, operator, dy, z);
				break;
			case "/":
				z = dx / dy;
				return calcRes(channel, dx, operator, dy, z);
				break;
			case "*":
				z = dx * dy;
				return calcRes(channel, dx, operator, dy, z);
				break;
			case "^":
				z = Math.pow(dx, dy);
				return calcRes(channel, dx, operator, dy, z);
				break;
			default:
				return calcErr(channel);
				break;
		}
	},
	
	about: function(channel)
	{
		var url = "https://cdn.discordapp.com/avatars/477763761629954060/f114c29fda258459d0518c80199f6630.png";
		let botembed = new Discord.RichEmbed()
		.setThumbnail(url)
		.setAuthor("Burgerbotz", url)
		.setDescription("Burgerbotz is an experimental bot created for research purposes made by A&A Consortium. Over time they decided to make the bot invite link public due to surging external interest in the bot. Albeit being public, the Burgerbotz team is committed at keeping the politically incorrect nature of the bot intact, for teh maximum intensity of lulz.")
		.addField("Developer(s)", "Grass finn (Cursed)#4357")
		.addField("Special Thanks", "SLiCK_Mx#0459, Annabelle#5819, Crash#5406, Naga#0550, madara#5203")
		.setColor("#fcc66a");
		
		return channel.send(botembed);
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
	},
	
	burger: function(channel, message, arr)
	{
		let yz = randomize(0, arr.length);
		var user = message.mentions.users.first();
		
		if(message.mentions.users.size < 1)
		{
			let botembed = new Discord.RichEmbed()
			.setImage(arr[yz])
			.setDescription(`:hamburger: **${message.author.username}** is eating a hamburger!`)
			.setColor("#fcc66a");
					
			return channel.send(botembed);		
		} else {
			let botembed = new Discord.RichEmbed()
			.setImage(arr[yz])
			.setDescription(`:hamburger: **${message.author.username}** is feeding a hamburger to **${user.username}**`)
			.setColor("#fcc66a");
					
			return channel.send(botembed);		
		}
	},
	
	nigger: function(channel, message)
	{
		var user = message.mentions.users.first();
		
		if(message.mentions.users.size < 1)
		{
			return message.reply("you have to mention someone to calculate the niggerness of!");
		} else {
			var result = randomize(0,100);
			if(!database[user.id]) database[user.id] = {nigger: result};
			
			if(database[user.id].nigger == null)
			{
				database[user.id] = {nigger: result};
			}
				
			var n = database[user.id].nigger;
					
			if(n >= 0 && n < 30)
			{
				return channel.send("<:dindu:454150474619289602> ***__Niggerator X3000__*** <:dindu:454150474619289602>\n\n:bar_chart: **" + user.username + "** : **" + database[user.id].nigger + "%**\n*Green flag! This person shows little to no signs of being a nigger.*");
			} else if(n >= 30 && n < 50) {
				return channel.send("<:dindu:454150474619289602> ***__Niggerator X3000__*** <:dindu:454150474619289602>\n\n:bar_chart: **" + user.username + "** : **" + database[user.id].nigger + "%**\n*This person could be a nigger for all we know, even though it's unlikely. Be safe!*");	
			} else if(n >= 50 && n < 75) {
				return channel.send("<:dindu:454150474619289602> ***__Niggerator X3000__*** <:dindu:454150474619289602>\n\n:bar_chart: **" + user.username + "** : **" + database[user.id].nigger + "%**\n*Be careful! This person is very likely to be a nigger! Utter not the forbidden word for your own sake!*");	
			} else {
				return channel.send("<:dindu:454150474619289602> ***__Niggerator X3000__*** <:dindu:454150474619289602>\n\n:bar_chart: **" + user.username + "** : **" + database[user.id].nigger + "%**\n*This person is almost undoubtedly a nigger.* :watermelon:**OOGA BOOGA DINDU NUFFIN!!1**:basketball:");	
			}
		}	
	},
	
	dm: function(channel, message, msg)
	{
		var user = message.mentions.users.first();
		
		if(message.mentions.users.size < 1)
		{
			message.reply("please specify a user to message.");
		} else {
			if(!user.bot)
			{
				delete msg[1];
				let msg1 = msg.join(" ");
				channel.send(":incoming_envelope: **Message sent!**");
				return user.send(msg1);
			} else {
				return channel.send(":octagonal_sign **You can only send direct messages to humans!**");	
			}
		}	
	},
	
	spit: function(channel, message, msg, arg)
	{
		var x = randomize(0, 5);
		console.log(msg[0]);
		if(msg[1] != null)
		{
			if(x > 1)
			{
				return channel.send(`${message.author}` + " has spitted on" + arg + "'s grave :purple_heart:");
			} else {
				return channel.send(`${message.author}` + " has took a shit on" + arg + "'s grave :poo:");
			}
		} else {
			return channel.send("Use /s to spit on something's grave");	
		}	
	},
	
	coinflip: function(message)
	{
		var x = randomize(0, 1);
		console.log(x);
		if(x === 0)
		{
			message.reply("you got heads");
		} else {
			message.reply("you got tails");
		}	
	},
	
	random: function(channel, args)
	{
		if(args[1] == null)
		{
			channel.send("Correct usage: /random <upper bound>");
		} else {
			var y = parseInt(args[1]);
			channel.send("Returned integer " + Math.floor(Math.random() * y));
		}	
	},
	
	ping: function(channel, message)
	{
		channel.send("***PONG!*** Returned request in " + (Date.now() - message.createdTimestamp) + " ms");
	}
};
