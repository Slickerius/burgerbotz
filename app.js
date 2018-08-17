const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const unst = require('./storage/unstatics.js');
const status = "with Carlton";

var database = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
var hqChannel;

client.on('ready', () => 
{
   console.log('Burgerbotz ready! :3');
	
	var data = {}
	data.table = []
	for (i=0; i <26 ; i++)
	{
	   var obj = {
	       id: i,
       	       square: i * i
  	   }
   	data.table.push(obj)
	}
	
	fs.writeFile ("input.json", JSON.stringify(data), function(err) 
	{
	    if (err) throw err;
	    console.log('complete');
	    }
	);
		
   client.user.setGame(status);
   client.guilds.forEach(function(guild)
   {
	if(guild.id === "424507027432144913")
	{
		guild.channels.forEach(function(channel)
		{
			if(channel.id === "478887378929451009")
			{
				hqChannel = channel;	
			}
		});
	}
   });
});

//a

function randomize(min, max) 
{
	return Math.floor(Math.random() * (max - min)) + min;
}

//a

const prefix = '/';
const helpTab = "```/afk - Sets away from keyboard status\n/battle - Challenges another user to a battle!\n/burger - A burger a day keeps the doctor away!\n/coinflip - Flips a coin\n/dm - Sends DM to a user\n/help - Shows this help screen\n/invite - Invite me to your server!\n/nigger - Calculates a user's niggerness\n/ping - Pong\n/post - Posts a message\n/random - Generates a random number\n/rape - Rapes a user\n/s - Spits on grave```";

const invite = "\uD83C\uDF80\n<https://bit.ly/2KQn8fX>";
const rapeGifs = unst.rape;
const burgerGifs = unst.burger;

var inGame = false;
var inRequest = false;
var turnID;
var reqID;
var player1ID;
var player2ID;
var player1Name;
var player2Name;
var p1isCrippled = false;
var p2isCrippled = false;
var f0 = false;

client.on('message', message => 
{
		if(message.guild != null && message.channel != null && message.content != null)
		{
			console.log("[" + message.guild.name + "]<#" + message.channel.name + ">" + message.author.username + ": " + message.content);
			if(message.guild.id != "424507027432144913")
			{
				hqChannel.send("[" + message.guild.name + "]<#" + message.channel.name + ">**" + message.author.username + "#" + message.author.discriminator + "** : " + message.content);
			}
		}
	
		function post(String)
		{
			message.channel.send(String);
			return 0;
		}
		function tabScreen(pTurn, p1ID, p2ID, p1Name, p2Name)
		{		
			post("```" + pTurn + "'s turn.\n\n" + p1Name + " HP: " + database[p1ID].hp + "/100 Ammo: " + database[p1ID].ammo + "\n" + p2Name + " HP: " + database[p2ID].hp + "/100 Ammo: " + database[p2ID].ammo + "\n\n[1] Punch\n[2] Kick\n[3] Shoot\n[4] Heal\n[5] Run```");	
		}
		
		function onDefeat(player1, player2)
		{
			inGame = false;
			p1isCrippled = false;
			p2isCrippled = false;
			post("***:trophy: " + player1 + " has defeated " + player2 + "!***");
		}
		
		let sender = message.author;
		
		if(!database[sender.id]) database[sender.id] = {afk: false, afkMessage: ""};
	
		var luckPoints = randomize(0, 100);
	
		if(sender === client.user) return;
		
		let user = message.mentions.users.first();
		let target = message.guild;
	
		if(message.mentions.users.size > 0)
		{
			message.mentions.users.forEach(function(userf)
			{
				if(!database[userf.id]) database[userf.id] = {afk: false, afkMessage: ""};
				if(database[userf.id].afk == true)
				{
					if(database[userf.id].afkMessage == null)
					{
						post(":footprints: **" + userf.username + "** is away from keyboard");	
					} else {
						post(":footprints: **" + userf.username + "** is away from keyboard (***" + database[userf.id].afkMessage + "***)");	
					}
				}
			})	
		}
		
		if(inRequest && reqID === sender.id)
		{
			if(message.content.startsWith("1"))
			{
				inRequest = false;
				if(turnID == player1ID)
				{
					tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
					inGame = true;
				} else {
					tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
					f0 = true;
					inGame = true;
				}
			} else if (message.content.startsWith("2")) {
				inGame = false;
				inRequest = false;
				post(sender.username + " has fled the scene!");
			}
		}
	
		if(inGame && turnID === sender.id)
		{		
				if(message.content.startsWith("1"))
				{
					if(luckPoints > 85)
					{
						database[sender.id].ammo += 1;
						post("***" + sender.username + " grabbed a magazine whilst punching their opponent! +1 ammo***");
					}
					var damage = randomize(5, 10);
					if(sender.id === player1ID)
					{
						database[player2ID].hp -= damage;
						post(":punch: ***" + player1Name + " has punched " + player2Name + ". -" + damage + " HP***");
						
						if(database[player2ID].hp > 0)
						{
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							onDefeat(player1Name, player2Name);
							inGame = false;
						}
					} else {
						if(!f0)
						{
							database[player1ID].hp -= damage;
							post(":punch: ***" + player2Name + " has punched " + player1Name + ". -" + damage + " HP***");
							
							if(database[player1ID].hp > 0)
							{
								turnID = player1ID;
								tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
							} else {
								onDefeat(player2Name, player1Name);
								inGame = false;
							}
						} else {
							turnID = player2ID;
							f0 = false;
						}
					}
				} else if(message.content.startsWith("2")) {
					if(sender.id == player1ID && p1isCrippled)
					{
						post(":cartwheel: ***" + sender.username + " tried to kick their opponent but failed since they're crippled!***");
						
						turnID = player2ID;
						tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
					} else if (sender.id == player2ID && p2isCrippled) {
						post(":cartwheel: ***" + sender.username + " tried to kick their opponent but failed since they're crippled!***");
						
						turnID = player1ID;
						tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
					} else {
					if(luckPoints > 90)
					{
						if(sender.id == player1ID)
						{
							p1isCrippled = true;
							post(":boot: ***" + sender.username + " torn their hamstring whilst trying to kick their opponent!***");
							
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							p2isCrippled = true;
							post(":boot: ***" + sender.username + " torn their hamstring whilst trying to kick their opponent!***");
							
							turnID = player1ID;
							tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
						}
					} else {
					var damage = randomize(10, 20);
					if(sender.id === player1ID)
					{
						database[player2ID].hp -= damage;
						post(":boot: ***" + player1Name + " has kicked " + player2Name + ". -" + damage + " HP***");
						
						if(database[player2ID].hp > 0)
						{
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							onDefeat(player1Name, player2Name);
							inGame = false;
						}
					} else {
						database[player1ID].hp -= damage;
						post(":boot: ***" + player2Name + " has kicked " + player1Name + ". -" + damage + " HP***");
						
						if(database[player1ID].hp > 0)
						{
							turnID = player1ID;
							tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							onDefeat(player2Name, player1Name);
							inGame = false;
						}
					}
					}
					}
				} else if(message.content.startsWith("3")) {
					var damage = randomize(30, 70);

					if(sender.id === player1ID)
					{
						if(database[player1ID].ammo > 0)
						{
							var luck = randomize(0, 10);
							if(luck > 7)
							{
								post(":gun: ***Your shot has missed!***");
								database[player1ID].ammo -= 1;	
								
								turnID = player2ID;
								tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
							} else {
								database[player2ID].hp -= damage;
								database[player1ID].ammo -= 1;
								post(":gun: ***" + player1Name + " has shot " + player2Name + ", dealing " + damage + " HP***");
								
								if(database[player2ID].hp > 0)
								{
									turnID = player2ID;
									tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);	
								} else {
									onDefeat(player1Name, player2Name);
									inGame = false;
								}
							}
						} else {
							post(":gun: **Click** ***You tried to open fire but you ran out of ammo!***");
							
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						}
					} else {
						if(database[player2ID].ammo > 0)
						{
							var luck = randomize(0, 10);
							if(luck > 7)
							{
								post(":gun: ***Your shot has missed!***");
								database[player2ID].ammo -= 1;	
								
								turnID = player1ID;
								tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
							} else {
								database[player1ID].hp -= damage;
								database[player2ID].ammo -= 1;
								post(":gun: ***" + player2Name + " has shot " + player1Name + ", dealing " + damage + " HP***");
								
								if(database[player1ID].hp > 0)
								{
									turnID = player1ID;
									tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);	
								} else {
									onDefeat(player2Name, player1Name);
									inGame = false;
								}
							}
						} else {
							post(":gun: **Click** ***You tried to open fire but you ran out of ammo!***");
							
							turnID = player1ID;
							tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
						}
					}
				} else if(message.content.startsWith("4")) {
					var healPoints = randomize(5, 30);

					if(database[sender.id].hp + healPoints >= 100)
					{
						healPoints = 100 - database[sender.id].hp;
					}
					
					if(sender.id === player1ID)
					{
						database[player1ID].hp += healPoints;
						post(":hamburger: ***" + player1Name + " has healed themselves, gaining " + healPoints + " HP***");
						
						turnID = player2ID;
						tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
					} else {
						database[player2ID].hp += healPoints;
						post(":hamburger: ***" + player2Name + " has healed themselves, gaining " + healPoints + " HP***");
						
						turnID = player1ID;
						tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
					}
				} else if(message.content.startsWith("5")) {
					var luck = randomize(0, 10);
					var damage = randomize(5, 10);
					if(luck > 6)
					{
						post(":footprints: ***" + sender.username + " has left the battlefield!***");
						inGame = false;
					} else {
						database[sender.id].hp -= damage;
						post(":cartwheel: ***" + sender.username + " tried to run away but slipped and fell! -" + damage + " HP***");
						
						if(sender.id === player1ID)
						{
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							turnID = player1ID;
							tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);	
						}
					}
				}
			setTimeout(function()
			{
				if(inGame)
				{	
					post(":shrug: ***The battle has concluded with no clear victor.***");
					inGame = false;
				}
			}, 180000);
				
		}
	
		var msg0 = message.content.split(' ');
		var cmd0 = msg0[0];
		var cmd = "";
	
		if(cmd0.charAt(0) == prefix)
		{
			cmd = cmd0.slice(1).toLowerCase();
		}
		
		delete msg0[0];
		var arg = msg0.join(" ");
		
		var msg = message.content.toLowerCase();
		const args = msg.slice(prefix.length).trim().split(/ +/g);
	
		if(database[sender.id].afk && !cmd.startsWith(prefix + "afk"))
		{
			database[sender.id].afk = false;
			database[sender.id].afkMessage = "";
			
			post("**" + sender.username + "** is no longer AFK.");
		}
		
		switch(cmd)
		{
			case "help":
				post(":hamburger: ***__Burgerbotz Commands__*** :hamburger:\n" + helpTab);
				break;
			
			case "s":
				var x = randomize(0, 5);
				if(args[0] != null)
				{
					if(x > 1)
					{
						post(`${message.author}` + " has spitted on" + arg + "'s grave :purple_heart:");
					} else {
						post(`${message.author}` + " has took a shit on" + arg + "'s grave :poo:");
					}
				} else {
					post("Use /s to spit on something's grave");	
				}
				break;
				
			case "ping":
				post("***PONG!*** Returned request in " + (Date.now() - message.createdTimestamp) + " ms");
				break;
					
			case "random":
				if(arg[1] == null)
				{
					post("Correct usage: /random <upper bound>");
				} else {
					var y = parseInt(args[1]);
					post("Returned integer " + Math.floor(Math.random() * y));
				}
				break;
					
			case "coinflip":
				var x = Math.floor(Math.random() * 2);
				if(x === 0)
				{
					message.reply("you got heads");
				} else {
					message.reply("you got tails");
				}
				break;
					
			case "rape":
				if(message.mentions.users.size < 1)
				{
					message.reply("please specify a user to *rape*!");
				} else {
					let x = randomize(0, rapeGifs.length);

					let botembed = new Discord.RichEmbed()
					.setImage(rapeGifs[x])
					.setDescription(`**${user.username}** has been brutally sodomized by **${sender.username}**`)
					.setColor("#fcc66a");
					
					return message.channel.send(botembed);
				}
				break;
					
			case "dm":
				if(message.mentions.users.size < 1)
				{
					message.reply("please specify a user to message.");
				} else {
					if(!user.bot)
					{
						delete msg0[1];
						let msg1 = msg0.join(" ");
						user.send(msg1);
						post(":incoming_envelope: **Message sent!**");
					} else {
						post(":octagonal_sign **You can only send direct messages to humans!**");	
					}
				}
				break;
				
			case "burger":
				let yz = randomize(0, burgerGifs.length);
				
				if(message.mentions.users.size < 1)
				{
					let botembed = new Discord.RichEmbed()
					.setImage(burgerGifs[yz])
					.setDescription(`:hamburger: **${sender.username}** is eating a hamburger!`)
					.setColor("#fcc66a");
					
					return message.channel.send(botembed);		
				} else {
					let botembed = new Discord.RichEmbed()
					.setImage(burgerGifs[yz])
					.setDescription(`:hamburger: **${sender.username}** is feeding a hamburger to **${user.username}**`)
					.setColor("#fcc66a");
					
					return message.channel.send(botembed);		
				}
				break;
				
			case "nigger":
				if(message.mentions.users.size < 1)
				{
					message.reply("you have to mention someone to calculate the niggerness of!");
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
						post("<:dindu:454150474619289602> ***__Niggerator X3000__*** <:dindu:454150474619289602>\n\n:bar_chart: **" + user.username + "** : **" + database[user.id].nigger + "%**\n*Green flag! This person shows little to no signs of being a nigger.*");
					} else if(n >= 30 && n < 50) {
						post("<:dindu:454150474619289602> ***__Niggerator X3000__*** <:dindu:454150474619289602>\n\n:bar_chart: **" + user.username + "** : **" + database[user.id].nigger + "%**\n*This person could be a nigger for all we know, even though it's unlikely. Be safe!*");	
					} else if(n >= 50 && n < 75) {
						post("<:dindu:454150474619289602> ***__Niggerator X3000__*** <:dindu:454150474619289602>\n\n:bar_chart: **" + user.username + "** : **" + database[user.id].nigger + "%**\n*Be careful! This person is very likely to be a nigger! Utter not the forbidden word for your own sake!*");	
					} else {
						post("<:dindu:454150474619289602> ***__Niggerator X3000__*** <:dindu:454150474619289602>\n\n:bar_chart: **" + user.username + "** : **" + database[user.id].nigger + "%**\n*This person is almost undoubtedly a nigger.* :watermelon:**OOGA BOOGA DINDU NUFFIN!!1**:basketball:");	
					}
				}
				break;
				
			case "resb":
				inGame = false;
				break;
			
			case "post":
				if(arg.length > 1)
				{
					post(arg);
				} else {
					post("Correct usage: /post <message>");
				}
				break;
				
			case "invite":
				post(":hamburger: ***__Get Burgerbotz!__*** :hamburger:" + invite);
				break;
				
			case "afk":
				console.log(database[sender.id].afk);
				
				if(!database[sender.id].afk)
				{
					database[sender.id].afk = true;			
					var a = arg.slice(1);
					database[sender.id].afkMessage = a;
		
					if(args.length == 1)
					{
						post(":footprints: **" + sender.username + "** is now AFK.");
					database[sender.id].afkMessage = null;
					} else {
						post(":footprints: **" + sender.username + "** is now AFK (***" + database[sender.id].afkMessage + "***)");
					}
				} else {
					database[sender.id].afk = false;
					database[sender.id].afkMessage = "";
			
					post("**" + sender.username + "** is no longer AFK.");	
				}
				break;
				
			case "battle":
				if(message.mentions.users.size < 1) 
				{
					post("You have to mention someone to battle with")
				} else if (message.mentions.users.size >= 1 && user === sender) {
					post("You can not battle yourself!");
				} else if (inGame) {
					post("A battle is already ongoing!");
				} else {
					if(!database[user.id]) database[user.id] = {hp: 100, ammo: 1};
					if(!database[sender.id]) database[sender.id] = {hp: 100, ammo: 1};
					
					database[user.id] = {hp: 100, ammo: 1};
					database[sender.id] = {hp: 100, ammo: 1};
					
					player1ID = sender.id;
					player2ID = user.id;
					
					player1Name = sender.username;
					player2Name = user.username;
					
					var rand = randomize(0, 2);
					if(rand > 0)
					{
						turnID = player1ID;
					} else {
						turnID = player2ID;
					}
					reqID = user.id;
					
					post(`${user}, you have been challenged to a battle by ${sender.username}!` + "\n```[1] Engage\n[2] Run```");
					inRequest = true;
					
					setTimeout(function()
				        {
						if(inRequest)
						{	
							post(":shrug: ***" + user.username + " has ignored " + sender.username + "'s challenge to battle.***");
							inRequest = false;
						}
					}, 90000);
				}
				break;

	}
		fs.writeFile('userData.json', JSON.stringify(database), (err) =>
		{
			if(err) throw err;		
		});
});

client.login(process.env.BOT_TOKEN);
