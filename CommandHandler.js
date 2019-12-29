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
	channel.send("__**Calculated expression:**__ **" + x + " " + operator + " " + y + " = " + res + "**");	
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
		if(isNaN(x) || isNaN(y))
		{
			return calcErr(channel);	
		}
		var dx, dy, z;
		
		dx = parseFloat(x);
		dy = parseFloat(y);
		
		if(dx != x || dy != y)
		{
			return calcErr(channel);
		} 
        	switch(operator)
		{
			case "+":
				z = dx + dy;
				return calcRes(channel, dx, dy, operator, z);
				break;
			case "-":
				z = dx - dy;
				return calcRes(channel, dx, dy, operator, z);
				break;
			case "/":
				z = dx / dy;
				return calcRes(channel, dx, dy, operator, z);
				break;
			case "*":
				z = dx * dy;
				return calcRes(channel, dx, dy, operator, z);
				break;
			case "^":
				z = Math.pow(dx, dy);
				return calcRes(channel, dx, dy, operator, z);
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
		.addField("Developer(s)", "Kanna Kobayashi#8377, Slick's K <3 (help me)#5132, >;C 𝒑𝒉𝒆𝒅𝒐𝒓𝒂𝒕𝒉𝒐𝒎𝒑𝒔𝒐𝒏 𝒕𝒘𝒐#2512")
		.addField("Special Thanks", "Annabelle, Skulldragon89#6969, TheLaundrySauce#6930")
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
	
	dm: function(channel, message, msg, userExists)
	{
		if(userExists) return;
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
				return channel.send(":octagonal_sign: **You can only send direct messages to humans!**");	
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
	
	bmi: function(channel, height, weight)
	{
		if(parseFloat(height) != height || parseFloat(weight) != weight)
		{
			channel.send(":scales: **Correct usage: /bmi <height> <weight>**\nWith height in centimeters (cm), weight in kilograms (kg). Decimal points allowed.\n*BMI (abbrev. **body mass index**) is a convenient rule of thumb used to broadly categorize a person as underweight, normal weight, overweight, or obese based on tissue mass (muscle, fat, and bone) and height*");
			return;
		}
		var h = parseFloat(height) / 100;
		var w = parseFloat(weight);
		var bmi_value = w / (h * h);
		bmi_value = bmi_value.toFixed(2);
		
		var out = ":scales: **Your BMI is: " + bmi_value + "**\nYour classification is: ";
		if(bmi_value < 18.50)
		{
			out += "**Underweight**.";	
		} else if(bmi_value >= 18.50 && bmi_value < 25.00) {
			out += "**Normal**.";
		} else if(bmi_value >= 25.00 && bmi_value < 30.00) {
			out += "**Overweight**";
		} else if(bmi_value >= 30.00) {
			out += "**Obese**";	
		}
		channel.send(out);
	},
	
	random: function(channel, args)
	{
		if(args[1] == null)
		{
			channel.send("**Correct usage: /random <upper bound>**");
		} else {
			var y = parseInt(args[1]);
			channel.send("Returned integer " + Math.floor(Math.random() * y));
		}	
	},
	
	ping: function(channel, message)
	{
		channel.send("***PONG!*** Returned request in " + (Date.now() - message.createdTimestamp) + " ms");
	},
	
	getReputationBar: function(reputation)
	{
		var red = "<:red:657479499725799426>";
		var red_ = "<:red_:657487997612195870>";
		var yellow = "<:yellow:657487824114810900>";
		var yellow_ = "<:yellow_:657487835707867142>";
		var green = "<:green:657487789247561729>";
		var green_ = "<:green_:657487798810443777>";
				
		var repBarArr = [red, red, red, red, red, yellow, green, green, green, green, green];
		if(x <= 10)
		{
			repBarArr[0] = red_;
		} else if(reputation <= 20) {
			repBarArr[1] = red_;
		} else if(reputation <= 30) {
			repBarArr[2] = red_;
		} else if(reputation <= 40) {
			repBarArr[3] = red_;
		} else if(reputation < 50) {
			repBarArr[4] = red_;
		} else if(reputation == 50) {
			repBarArr[5] = yellow_;
		} else if(reputation <= 60) {
			repBarArr[6] = green_;
		} else if(reputation <= 70) {
			repBarArr[7] = green_;
		} else if(reputation <= 80) {
			repBarArr[8] = green_;
		} else if(reputation <= 90) {
			repBarArr[9] = green_;
		} else if(reputation <= 100) {
			repBarArr[10] = green_;
		}
		var repBar = repBarArr.join(' ');
		return repBar;
	},
	
	getInventory: function(name, drinks)
	{
		var out = "__**:briefcase: " + name + "'s Inventory**__\n<:drink:660031984092839947> **Energy Drinks : " + drinks + "**\nType **/store** to buy items!";
		return out;
	},
	
	getStars(rating)
	{
		var star = ":star: ";
		var halfStar = "<:half_star:660769776129409024> ";
		var emptyStar = "<:empty_star:660769776125345832> ";
		var out = emptyStar + emptyStar + emptyStar + emptyStar + emptyStar;
		if(rating == 0.5)
		{
			out = halfStar + emptyStar + emptyStar + emptyStar + emptyStar;
		} else if(rating == 1) {
			out = star + emptyStar + emptyStar + emptyStar + emptyStar;
		} else if(rating == 1.5) {
			out = star + halfStar + emptyStar + emptyStar + emptyStar;
		} else if(rating == 2) {
			out = star + star + emptyStar + emptyStar + emptyStar;
		} else if(rating == 2.5) {
			out = star + star + halfStar + emptyStar + emptyStar;
		} else if(rating == 3) {
			out = star + star + star + emptyStar + emptyStar;
		} else if(rating == 3.5) {
			out = star + star + star + halfStar + emptyStar;
		} else if(rating == 4) {
			out = star + star + star + star + emptyStar;
		} else if(rating == 4.5) {
			out = star + star + star + star + halfStar;
		} else if(rating == 5) {
			out = star + star + star + star + star;
		}
		return out;
	},
	
	getUserDescription(username, wealth, reputation)
	{
		var out = "**" + username + "** is a";
		if(wealth < 50)
		{
			out += "n impoverished, ";	
		} else if(wealth < 100) {
			out += " poor, ";
		} else if(wealth < 1000) {
			out += " moderately funded, ";	
		} else if(wealth < 2500) {
			out += " fulfilled, ";	
		} else if(wealth < 5000) {
			out += " well funded ";	
		} else if(wealth < 10000) {
			out += " rich, ";	
		} else {
			out += " super-rich, ";	
		} 
		
		if(reputation == 50) 
		{
			out += " neutral ";	
		} else if(reputation <= 10) {
			out += " diabolical ";	
		} else if(reputation <= 20) {
			out += " evil ";	
		} else if(reputation <= 30) {
			out += " immoral ";	
		} else if(reputation <= 40) {
			out += " bad ";	
		} else if(reputation <= 50) {
			out += " unreputable ";	
		} else if(reputation <= 60) {
			out += " reputable ";	
		} else if(reputation <= 70) {
			out += " kind ";	
		} else if(reputation <= 80) {
			out += " pleasant ";	
		} else if(reputation <= 90) {
			out += " revered ";	
		} else if(reputation <= 100) {
			out += " Godly ";	
		}
		
		out += "person."
		return out;
	}
};
