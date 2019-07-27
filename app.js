const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const request = require('request');
const unst = require('./storage/unstatics.js');
const handler = require('./CommandHandler.js');
const status = "with Carlton";
const stockApiKey = "4MAQ744ZHW6LDYAK";

var database = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
var temp = JSON.parse(fs.readFileSync('temp.json', 'utf8'));
var phoneRoom = {"foo": "bar"};
var indices = {"foo": "bar"};
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

client.on('guildMemberAdd', member =>
{
	if(member.guild.id == "424507027432144913")
	{
		member.user.send("**Hello!**\nWelcome to **Livlisky**! We are a community in which freedom of expression is highly regarded, you are free to be reasonable and friendly or shitpost to your heart's content, it is up to you!\n\n**Enjoy your stay ;)**");
	}
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
					post("Guessed incorrectly. You got **tails**!");
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
					post("Guessed incorrectly. You got **heads**!");
					temp[sender.id].inGame = 0;
				}
			}
		}
	
		if(temp[sender.id].inReqR == 1)
		{
			message.content.toLowerCase();
			var ms = "__**Rock Paper Scissors**__\nChoose: rock/paper/scissors(r/p/s)";
			if(message.content == "y" || message.content == "yes")
			{
				var x = temp["ids"].sender.username;
				var y;
				client.users.forEach(function(dx)
				{
					if(dx.id == x)
					{
						y = dx;
					}
				});
				temp[sender.id].inReqR = 0;
				temp[sender.id].inRGame = 1;
				temp[x].inRGame = 1;
				sender.send(ms);
				y.send(ms);
			} else if(message.content == "n" || message.content == "no") {
				temp[sender.id].inReqR = 0;
				post("**RPS game request declined.");
			} else {
				post(":octagonal_sign: That's not a valid response!");	
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
					if(luckPoints > 95)
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
					var success = randomize(0, 100);

					if(temp[sender.id].hp + healPoints >= 100)
					{
						healPoints = 100 - temp[sender.id].hp;
					}
					
					if(sender.id === player1ID)
					{
						if(success <= 70) 
						{
							temp[player1ID].hp += healPoints;
							post(":hamburger: ***" + player1Name + " has healed themselves, gaining " + healPoints + " HP***");
						
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							post(":dizzy_face: ***" + player1Name + " tried to heal themselves but failed!***");
							
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						}
					} else {
						if(success <= 70)
						{
							temp[player2ID].hp += healPoints;
							post(":hamburger: ***" + player2Name + " has healed themselves, gaining " + healPoints + " HP***");
							
							turnID = player1ID;
							tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							post(":dizzy_face: ***" + player2Name + " tried to heal themselves but failed!***");
							
							turnID = player1ID;
							tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
						}
					}
				} else if(message.content.startsWith("5")) {
					var luck = randomize(0, 10);
					var damage = randomize(5, 10);
					if(luck > 8)
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
		
		if(phoneRoom[message.channel.id] != "")
		{
			for(var key in phoneRoom)
			{
				client.channels.forEach(function(channel)
				{
					if(channel.id == key && phoneRoom[message.channel.id] == phoneRoom[channel.id])
					{
						if(sender.id == "477763761629954060" || channel.id == message.channel.id) return;
						channel.send("**[" + phoneRoom[channel.id] + "]" + sender.username + "#" + sender.discriminator + ":** " + message.content);
						message.attachments.forEach(function(attachment)
						{
							channel.send({
							files: [attachment.url]
							});	
						});	
					}
				});
			}
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
				
			case "q":
			if(args[1] == parseInt(args[1]) && args[2] == parseInt(args[2]) && args[3] == parseInt(args[3]))
			{
				var a = parseInt(args[1]);
				var b = parseInt(args[2]);
				var c = parseInt(args[3]);
				
				var _a = a.toString();
				if(a == -1) _a = "-";
				if(a == 1) _a = "";
				
				var __b = "+ " + b + "x";
				if(b < 0) __b = "- " + Math.abs(b) + "x";
				if(b == 0) __b = "";
				
				var _c = "+ " + c;
				if(c < 0) _c = "- " + Math.abs(c);
				if(c == 0) _c = "";
				
				var _b = b * -1;
				var _b2 = b * b;
				var _4ac = 4 * a * c;
				var _2a = 2 * a;
				
				var x1 = (_b + Math.sqrt(_b2 - _4ac)) / _2a;
				var x2 = (_b - Math.sqrt(_b2 - _4ac)) / _2a;
				
				if(a == 0)
				{
					post("The **a** value cannot be 0!");
					return;
				}
				
				if(isNaN(x1) || isNaN(x2))
				{
					post("The quadratic equation **" + _a + "x² " + __b + " " + _c + " = 0** has the root pair of **(" + _b + " ± i√" + Math.abs((_b2 - _4ac)) + ") / " + _2a + "**.");
					return;
				}
				
				var _x1 = Math.abs(x1);
				var _x2 = Math.abs(x2);
				
				if(x1 > 0 && x2 > 0)
				{
					post("The quadratic equation **" + _a + "x² " + __b + " " + _c + " = 0** has roots of **" + x1 + "** and **" + x2 + "**.\nThe factors are **(x - " + _x1 + ")(x - " + _x2 + ")**. \nThe root pair is **(" + _b + " ± √" + (_b2 - _4ac) + ") / " + _2a + "**.");
				} else if(x1 > 0 && x2 < 0) {
					post("The quadratic equation **" + _a + "x² " + __b + " " + _c + " = 0** has roots of **" + x1 + "** and **" + x2 + "**.\nThe factors are **(x - " + _x1 + ")(x + " + _x2 + ")**. \nThe root pair is **(" + _b + " ± √" + (_b2 - _4ac) + ") / " + _2a + "**.");
				} else if(x1 < 0 && x2 > 0) { 
					post("The quadratic equation **" + _a + "x² " + __b + " " + _c + " = 0** has roots of **" + x1 + "** and **" + x2 + "**.\nThe factors are **(x + " + _x1 + ")(x - " + _x2 + ")**. \nThe root pair is **(" + _b + " ± √" + (_b2 - _4ac) + ") / " + _2a + "**.");
				} else if(x1 < 0 && x2 < 0) {
					post("The quadratic equation **" + _a + "x² " + __b + " " + _c + " = 0** has roots of **" + x1 + "** and **" + x2 + "**.\nThe factors are **(x + " + _x1 + ")(x + " + _x2 + ")**. \nThe root pair is **(" + _b + " ± √" + (_b2 - _4ac) + ") / " + _2a + "**.");
				}
				return;
			}
				ch.send({files: ['https://cdn.discordapp.com/attachments/563998568940306437/573793996694880256/unknown.png']});
				post(":symbols: *Find roots, factors for quadratic equations using Burgerbotz quadratic equation solver!*\n**Usage: /q <a> <b> <c>**");
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
						if(database[sender.id].burgers - parseInt(args[1]) >= 0)
						{
							if(parseInt(args[1]) < 0) return post("You must enter a positive number.");
							
							if(!temp[sender.id]) temp[sender.id] = {inGame: 1, stake: args[1]};
							temp[sender.id] = {inGame: true, stake: args[1]};
							database[sender.id].burgers -= parseInt(args[1]);
							post(":money_with_wings: __***Coinflip***__ :money_with_wings:\n**Stake: :hamburger: " + args[1] + "**\n*Choose: heads/tails? (h/t)*");
						} else {
							post(":octagonal_sign: You have insufficient burgers to do this bet.");	
						}
					}
				}
				break;
				
			case "calc":
				handler.calc(ch, args[1], args[2], args[3]);
				break;
					
			case "rape":
				handler.rape(ch, message, rapeGifs);
				break;
				
			case "fx":
				var json = '{';
				for(var x in database)
				{
					json += '"' + x + '":{"burgers":' + database[x].burgers + '},';
				}
				json += '}';
				console.log(json);
				break;
					
			case "fz":
				var usernames = ["Annabelle", "Skyler ツ", "HackRazor1012", "Grass finn (Cursed)", "Tsumiki", "`'`", "Le_Despair", "°°°", "Shady Stranger"];
				client.users.forEach(function(dx)
				{
					usernames.forEach(function(dy)
					{
						if(dx.username == dy)
						{
							post(dy + " : " + dx.id);	
						}
					});
				});
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
				
			case "about":
				handler.about(ch);
				break;
			
			case "markets":
				var out = "Dow Jones: ";
				
				var req_dji_val = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=^DJI&interval=1min&apikey=" + stockApiKey;
				var req_sp500_val = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=^INX&interval=1min&apikey=" + stockApiKey;
				var req_nasdaq_val = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=NASDAQ:^IXIC&interval=1min&apikey=" + stockApiKey;
				var req_rus2000_val = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=^RUT&interval=1min&apikey=" + stockApiKey;
				
				var req_dji = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^DJI&apikey=" + stockApiKey;
				var req_sp500 = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^INX&apikey=" + stockApiKey;
				var req_nasdaq = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NASDAQ:^IXIC&apikey=" + stockApiKey;
				var req_rus2000 = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^RUT&apikey=" + stockApiKey;
				
				var dji;
				var dji_change;
				var dji_dir;
				
				var sp500;
				var sp500_change;
				var sp500_dir;
				
				var nasdaq;
				var nasdaq_change;
				var nasdaq_dir;
				
				var rus2000;
				var rus2000_change;
				var rus2000_dir;
				
				request(req_dji_val, function(error, response, body) 
				{
					const content = JSON.parse(body);
					var lastRef = content['Meta Data']['3. Last Refreshed'];
					dji = parseFloat(content['Time Series (1min)'][lastRef]['4. close']);
					dji = dji.toFixed(2);
					
					out += "***** Dow Jones Industrial Average : **" + dji + "** ";
					request(req_dji, function(error, response, body) 
					{
						const content = JSON.parse(body);
						var lastRef = content['Meta Data']['3. Last Refreshed'];
						var lastClose = parseFloat(content['Time Series (Daily)'][lastRef]['4. close']);
						dji_change = ((dji - lastClose) / lastClose) * 100;
						dji_change = Math.abs(dji_change);
						dji_change = dji_change.toFixed(2);
						
						if(dji > lastClose)
						{
							out += "<:_bull_:602373998214512670>+" + dji_change + "%\n";
						} else {
							out += "<:_bear_:602374398959288321>-" + dji_change + "%\n";
						}
						
						request(req_sp500_val, function(error, response, body) 
						{
							const content = JSON.parse(body);
							var lastRef = content['Meta Data']['3. Last Refreshed'];
							sp500 = content['Time Series (1min)'][lastRef]['4. close'];
							sp500 = sp500.toFixed(2);
						
							out += "***** S&P 500 : **" + sp500 + "** ";
							request(req_sp500, function(error, response, body) 
							{
								const content = JSON.parse(body);
								var lastRef = content['Meta Data']['3. Last Refreshed'];
								var lastClose = parseFloat(content['Time Series (Daily)'][lastRef]['4. close']);
								sp500_change = ((sp500 - lastClose) / lastClose) * 100;
								sp500_change = Math.abs(sp500_change);
								sp500_change = sp500_change.toFixed(2);
								
								if(sp500 > lastClose)
								{
									out += "<:_bull_:602373998214512670>+" + sp500_change + "%\n";
								} else {
									out += "<:_bear_:602374398959288321>-" + sp500_change + "%\n";
								}

								request(req_nasdaq_val, function(error, response, body) 
								{
									const content = JSON.parse(body);
									var lastRef = content['Meta Data']['3. Last Refreshed'];
									nasdaq = content['Time Series (1min)'][lastRef]['4. close'];
									nasdaq = nasdaq.toFixed(2);
									
									out += "***** NASDAQ Composite : **" + nasdaq + "** ";
									request(req_nasdaq, function(error, response, body) 
									{
										const content = JSON.parse(body);
										var lastRef = content['Meta Data']['3. Last Refreshed'];
										var lastClose = parseFloat(content['Time Series (Daily)'][lastRef]['4. close']);
										nasdaq_change = ((dji - lastClose) / lastClose) * 100;
										nasdaq_change = Math.abs(nasdaq_change);
										
										if(nasdaq > lastClose)
										{
											out += "<:_bull_:602373998214512670>+" + nasdaq_change + "%\n";
										} else {
											out += "<:_bear_:602374398959288321>-" + nasdaq_change + "%\n";
										}
										
										request(req_rus2000_val, function(error, response, body) 
										{
											const content = JSON.parse(body);
											var lastRef = content['Meta Data']['3. Last Refreshed'];
											rus2000 = content['Time Series (1min)'][lastRef]['4. close'];
											rus2000 = rus2000.toFixed(2);
											
											out += "***** Russell 2000 : **" + rus2000 + "** ";
											request(req_rus2000, function(error, response, body) 
											{
												const content = JSON.parse(body);
												var lastRef = content['Meta Data']['3. Last Refreshed'];
												var lastClose = parseFloat(content['Time Series (Daily)'][lastRef]['4. close']);
												rus2000_change = ((dji - lastClose) / lastClose) * 100;
												rus2000_change = Math.abs(rus2000_change);
												rus2000_change = rus2000_change.toFixed(2);
												
												if(rus2000 > lastClose)
												{
													out += "<:_bull_:602373998214512670>+" + nasdaq_change + "%";	
												} else {
													out += "<:_bear_:602374398959288321>-" + nasdaq_change + "%";	
												}

											});
										});
									});
								});
							});
						});
					});
				});
				break;
				
			case "stock":
				console.log(args.length + " " + args);
				if(args.length < 2)
				{
					post("__**Usage:**__ /stock <ticker>\n*A ticker is an abbreviation used to uniquely identify publicly traded shares of a particular stock on a particular stock market.*\nExamples: **MSFT** - Microsoft Corporation, **JPM** - JP Morgan Chase & Co.");
					return;	
				}
				
				var req = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + args[1] + "&apikey=" + stockApiKey;
				var today = new Date();
				
				var date;
				var prevDate;
				
				request(req, function(error, response, body) 
				{
					console.log('error:', error);
					console.log('statusCode:', response && response.statusCode);
				
					const content = JSON.parse(body);
					
					if(content['Meta Data'] == null || content['Time Series (Daily)'] == null)
					{
						post("__**Usage:**__ /stock <ticker>\n*A ticker is an abbreviation used to uniquely identify publicly traded shares of a particular stock on a particular stock market.*\nExamples: **MSFT** - Microsoft Corporation, **JPM** - JP Morgan Chase & Co.");
						return;
					}
					
					date = content['Meta Data']['3. Last Refreshed'];
					prevDate = new Date(date);
					prevDate.setDate(prevDate.getDate() - 1);
					if(prevDate.getMonth() < 9)
					{
						prevDate = prevDate.getFullYear() + '-0' + (prevDate.getMonth() + 1) + '-' + (prevDate.getDate() - 1);
					} else if(prevDate.getMonth() >= 9) {
						prevDate = prevDate.getFullYear() + '-' + (prevDate.getMonth() + 1) + '-' + (prevDate.getDate() - 1);
					}
					
					var close = content['Time Series (Daily)'][date]['4. close'];
					var prevClose = content['Time Series (Daily)'][prevDate]['4. close'];
					var open = content['Time Series (Daily)'][date]['1. open'];
					var high = content['Time Series (Daily)'][date]['2. high'];
					var low = content['Time Series (Daily)'][date]['3. low'];
					var volume = content['Time Series (Daily)'][date]['5. volume'];
					
					var change = ((parseFloat(content['Time Series (Daily)'][prevDate]['4. close']) - parseFloat(content['Time Series (Daily)'][date]['4. close'])) / parseFloat(content['Time Series (Daily)'][prevDate]['4. close'])) * 100;
					change = change.toFixed(2);
					change = Math.abs(change);
					
					if(parseFloat(content['Time Series (Daily)'][date]['4. close']) > parseFloat(content['Time Series (Daily)'][prevDate]['4. close']))
					{
						post("__**" + args[1].toUpperCase() + "**__: **" + close + "** <:_bull_:602373998214512670>+" + change + "%\nOpen: **" + open + "**\nDay High: **" + high + "**\nDay Low: **" + low + "**\nPrevious Close: **" + prevClose + "**\nVolume: **" + volume + "**");
					} else {
						post("__**" + args[1].toUpperCase() + "**__: **" + close + "** <:_bear_:602374398959288321>-" + change + "%\nOpen: **" + open + "**\nDay High: **" + high + "**\nDay Low: **" + low + "**\nPrevious Close: **" + prevClose + "**\nVolume: **" + volume + "**");
					}
				});
				
				break;
				
			case "baltop":
			case "balancetop":
				var y = "```-=[Burgerbotz World Ranking]=-\n\n";
				var z = 1;
				var p = "";
				
				var m = [];
				for(var x in database)
				{
					m.push({id: x, burgers: database[x].burgers});
				}
				
				m.sort(function (a, b) 
				{
					return b.burgers - a.burgers;
				});
				
				for(var x in m)
				{
					if(z <= 10)
					{
						var t;
						client.users.forEach(function(dx)
						{
							if(dx.id == m[x].id) t = dx.username;	
						});		
						
						if(t != p)
						{
							y += "[" + z + "] " + t + "\nHamburgers: " + m[x].burgers + "\n\n";
							z++;
						}
						p = t;
					}
				}
				
				y += "```";
				
				post(y);
				
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
					if(database[user.id] == null) database[user.id] = {burgers: 100};
					if(isNaN(database[user.id].burgers)) database[user.id].burgers = 100;
					post(`**:diamond_shape_with_a_dot_inside: ${user.username}**'s *balance contains* :hamburger: **` + database[user.id].burgers + `**`);
				}
				break;
				
			case "pay":
				var arg0 = args[2];
				if(message.mentions.users.size < 1)
				{
					for(var x in database)
					{
						if(args[1] == x)
						{
							if(parseInt(arg0) < 0) return post("You must enter a positive number.");
							
							if(database[sender.id].burgers - parseInt(arg0) >= 0)
							{
								if(isNaN(database[x].burgers)) database[x].burgers = 100;
								database[x].burgers += parseInt(arg0);							
								database[sender.id].burgers -= arg0;
								post("*Successfully given* :hamburger: **" + arg0 + "** *to user* **" + x + "**!");
								client.users.forEach(function(u)
								{
									if(u.id == x)
									{
										u.send("User **" + sender.username + "#" + sender.discriminator + "** has sent you a total of :hamburger: **" + arg0 + "**!");	
									}
								});
							} else {
								post("You have insufficient burgers to make this transaction!");	
							}
							return;
						}
					}
					post("You have to mention another user.");
				} else {
					if(arg0 == parseInt(arg0))
					{
						if(!database[user.id])
						{
							database[user.id] = {burgers: 100};
						}
						
						if(parseInt(arg0) < 0) return post("You must enter a positive number.");
						
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
				
			case "burgerphone":
			case "bp":
				console.log(phoneRoom[message.channel.id]);
				if(phoneRoom[message.channel.id] == null) phoneRoom[message.channel.id] = "";
				if(phoneRoom[message.channel.id] != "")
				{
					post(":telephone: **Successfully disconnected from room '" + phoneRoom[message.channel.id] + "'.**");
					phoneRoom[message.channel.id] = "";
					return;
				}
				
				if(args.length < 2 && phoneRoom[message.channel.id] == "")
				{
					post(":octagonal_sign: **Usage:** /burgerphone <room ID>");
					return;
				}
				
				phoneRoom[message.channel.id] = args[1];
				post(":telephone: **Successfully connected to room '" + phoneRoom[message.channel.id] + "'! Say hello!**");
				for(var key in phoneRoom)
				{
					client.channels.forEach(function(channel)
					{
						if(channel.id == key && phoneRoom[message.channel.id] == phoneRoom[channel.id] && channel.id != message.channel.id)
						{
							channel.send(":door: **Someone new has joined the room! Say hi!**");
						}
					});
				}
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
	
			case "aadv":
				message.guild.members.forEach(function(member) { member.addRole("509640521585524747"); } );
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
