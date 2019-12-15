const Discord = require('discord.js');
const fs = require('fs');
const request = require('request');
const unst = require('./storage/unstatics.js');
const handler = require('./CommandHandler.js');
const randomEvents = require('./RandomEvents.js');

const client = new Discord.Client();

const dbURL = process.env.DBURL;
const status = "/help";
const stockApiKey = "4MAQ744ZHW6LDYAK";

var database = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
var temp = JSON.parse(fs.readFileSync('temp.json', 'utf8'));
var phoneRoom = {"x": "y"};
var indices = {"x": "y"};
var inviteObjects = {"x": 0};

var eventTracker = {"x": 0, "391239140068294659": 1};
var eventStage = {"x": 0, "391239140068294659": 0};

var hqChannel;
var joinChannel, leaveChannel, mainChannel;

var gdp_r_verif;

client.on('ready', () => 
{
   	console.log('Burgerbotz ready! :3');
	gdp_r_verif = randomize(10000, 99999);
	console.log(gdp_r_verif);
	
	var data = {};
	data.table = [];
	for (i = 0; i < 26; i++)
	{
	   	var obj = 
		{
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
	if(guild.id === "616246848868450335")
	{
		guild.channels.forEach(function(channel)
		{
			if(channel.id === "616246849367441428")
			{
				hqChannel = channel;	
			}
		});
	}
	if(guild.id === "613500872839921675")
	{
		guild.channels.forEach(function(channel)
		{
			if(channel.id === "620578833225220106")
			{
				joinChannel = channel;	
			} 
			if(channel.id === "620578888610873355") 
			{
				leaveChannel = channel;	
			}
			if(channel.id === "620395189940387871") 
			{
				mainChannel = channel;	
			}
		});
		
		var invites = guild.fetchInvites()
			.then(invite => {
				var invArr = invite.array();
				for(i = 0; i < invArr.length; i++)
				{
					var inv = invArr[i];
					//var no = i + 1;
					//message.channel.send("[" + no + "] " + inv.uses + " - " + inv.inviter.username + " - " + inv.code);
					inviteObjects[inv.code] = inv.uses;
					console.log("Compiled " + inv.code + " into inviteObjects.");
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
	if(member.guild.id == "613500872839921675")
	{
		member.user.send("Welcome to the **" + member.guild.name + "**! Unlike most servers, there isn't a lot of *crippling* rules to bar your freedom of speech here. Just have fun alright?");
		var invites = member.guild.fetchInvites()
			.then(invite => {
				var invArr = invite.array();
				var invitesObjectTest = {"x" : 0};
				for(i = 0; i < invArr.length; i++)
				{
					var inv = invArr[i];
					invitesObjectTest[inv.code] = inv.uses;
					console.log("A");
				}
				for(const [key, value] of Object.entries(invitesObjectTest)) 
				{
  					if(invitesObjectTest[key] !== inviteObjects[key])
					{
						console.log("Found!");
						for(i = 0; i < invArr.length; i++)
						{
							var inv = invArr[i];
							if(inv.code == key)
							{
								joinChannel.send("User " + member.user + " has joined the brotherhood. Bid them your warmest welcome!\nInvited by: **" + inv.inviter.username + "#" + inv.inviter.discriminator + "** using the invite code **" + inv.code + "**.");
								for(const [key, value] of Object.entries(invitesObjectTest)) 
								{
									inviteObjects[key] = invitesObjectTest[key];
								}
							}
						}
					}
				}
			});
	}
});

client.on('guildMemberRemove', member =>
{	
	if(member.guild.id == "613500872839921675")
	{
		leaveChannel.send("**" + member.user.username + "#" + member.user.discriminator + "** has withdrawn their presence from the brotherhood. Until next time.");
	}
});

function randomize(min, max) 
{
	return Math.floor(Math.random() * (max - min)) + min;
}

function factorial(n) 
{
	if ( n == 1 ) 
	{
  		return 1;
	}
	return n * factorial(n - 1)
}

//a

const prefix = '/';
const flags = unst.flags;

const invite = "\n<https://bit.ly/2Hv31F8>";
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
		let sender = message.author;
		let ch = message.channel;
	
		var randomEventOccurring = randomize(0, 75);
		console.log(randomEventOccurring);
		if(randomEventOccurring == 10) 
		{
			var eventRandomizer = randomize(0, 2);
			if(eventRandomizer == 0)
			{
				eventTracker[sender.id] = 0;
			} else if(eventRandomizer == 1) {
				eventTracker[sender.id] = 1;
			}
			eventStage[sender.id] = 0;
		}
		
		request(dbURL, function(error, response, body) 
		{
			var db = JSON.parse(body);
			if(!db[message.author.id]) 
			{
				db[message.author.id] = {burgers: 100};
				console.log("Created new DB data for user: " + message.author.name + "#" + message.author.discriminator);
			}
		});
		var date = message.createdAt;
	
		for(var key in eventTracker)
		{
			if(key == message.author.id)
			{
				if(eventTracker[key] == 0)
				{
					var value = randomize(5, 200);
					if(eventStage[key] == 0)
					{
						randomEvents.call(ch, 0, 0, value);
						eventStage[key] = 1;
					} else if(eventStage[key] == 1) {
						var stage;
						if(message.content.startsWith("1"))
						{
							stage = randomize(1, 3);
							randomEvents.call(ch, 0, stage, value);	
						} else if(message.content.startsWith("2")) {
							stage = randomize(3, 5);
							randomEvents.call(ch, 0, stage, value);	
						} else if(message.content.startsWith("3")) {
							randomEvents.call(ch, 0, 5, value);	
						} else {
							return;	
						}
						
						delete eventTracker[key];
						delete eventStage[key];
						
						if(stage == 1 || stage == 3) return;
						
						request(dbURL, function(error, response, body) 
						{
							db = JSON.parse(body);
							db[message.author.id].burgers -= value;
							if(db[message.author.id].burgers < 0) db[message.author.id].burgers = 0;
							request(
							{
  								method: "PUT",
  								uri: dbURL,
  								json: db
 							});
						});
					}
				} else if(eventTracker[key] == 1) {
					var value = randomize(50, 2500);
					var fine = randomize(50, 500);
					if(eventStage[key] == 0)
					{
						randomEvents.call(ch, 1, 0, 0);
						eventStage[key] = 1;
					} else if(eventStage[key] == 1) {
						var stage;
						if(message.content.startsWith("1"))
						{
							stage = randomize(1, 4);
							if(stage == 3)
							{
								randomEvents.call(ch, 1, stage, fine);
							} else {
								console.log(stage);
								randomEvents.call(ch, 1, stage, value);	
							}
						} else if(message.content.startsWith("2")) {
							randomEvents.call(ch, 1, 4, value);	
						} else if(message.content.startsWith("3")) {
							stage = randomize(5, 7);
							if(stage == 6) randomEvents.call(ch, 1, stage, value);
						} else {
							return;	
						}
						delete eventTracker[key];
						delete eventStage[key];
						
						if(stage == 2 || stage == 4 || stage == 6) return;
						
						request(dbURL, function(error, response, body) 
						{
							db = JSON.parse(body);
							var tip = randomize(0, 3);
							if(stage == 1)
							{
								db[message.author.id].burgers += value;
							} else if(stage == 3) {
								db[message.author.id].burgers -= fine;
							} else if(stage == 5) {
								if(tip == 0)
								{
									randomEvents.call(ch, 1, stage, (value / 2));	
									db[message.author.id].burgers += value / 2;
								} else if(tip == 1) {
									randomEvents.call(ch, 1, stage, value);	
									db[message.author.id].burgers += value;
								} else if(tip == 2) {
									randomEvents.call(ch, 1, stage, (value * 2));	
									db[message.author.id].burgers += value * 2;
								}
							}
							if(db[message.author.id].burgers < 0) db[message.author.id].burgers = 0;
							request(
							{
  								method: "PUT",
  								uri: dbURL,
  								json: db
 							});
						});
					}
				}
			}
		}
	
		if(inFGame)
		{
			var response = message.content.toLowerCase(), flagName = flags[flagID].name.toLowerCase();
			
			if(response.includes(flagName))
			{
				var req = dbURL;
				var db;
				request(req, function(error, response, body) 
				{
					db = JSON.parse(body);
					var x = randomize(25, 100);
					post(":trophy: ***" + message.author.username + "** has guessed correctly! Answer: **" + flags[flagID].name + "\nGiven :hamburger: " + x + " as prize.***");
					db[message.author.id].burgers += x;
					db["gdp"].total += x;
					db["gdp"].flags += x;
					request(
					{
  						method: "PUT",
  						uri: req,
  						json: db
 					});
				});
				clearTimeout(flagTimeout);
				inFGame = false;
			}
		}
		
		if(message.guild != null && message.channel != null && message.content != null)
		{
			console.log("[" + message.guild.name + "]<#" + message.channel.name + ">" + message.author.username + ": " + message.content);
			if(message.guild.id != "616246848868450335")
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
			var req = dbURL;
			inGame = false;
			p1isCrippled = false;
			p2isCrippled = false;
			post("***:trophy: " + player1 + " has defeated " + player2 + "!\nGiven :hamburger: " + x + " as a prize.***");
			console.log(database[winID].burgers);
			console.log(database[winID]);
			request(req, function(error, response, body) 
			{
				db = JSON.parse(body);
				if(!db[winID]) db[winID] = {burgers: 100};
				db[winID].burgers += x;
				
				db["gdp"].battle += x;
				db["gdp"].total += x;
				request(
				{
  					method: "PUT",
  					uri: req,
  					json: db
 				});
			});
		}
		
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
			
			request(dbURL, function(error, response, body) 
			{
				var db = JSON.parse(body);
				if (y == "h" || y == "heads")
				{
					if(x == 0)
					{
						post("*Guessed correctly! You got **heads***\n*Your prize:* :hamburger: **" + z + "**");
						db[sender.id].burgers += z;
						request(
						{
  							method: "PUT",
  							uri: dbURL,
  							json: db
 						});
					} else {
						post("Guessed incorrectly. You got **tails**!");
					}
				}
				else if(y == "t" || y == "tails")
				{
					if(x == 1)
					{
						post("*Guessed correctly! You got **tails***\n*Your prize:* :hamburger: **" + z + "**");
						db[sender.id].burgers += z;
						request(
						{
  							method: "PUT",
  							uri: dbURL,
  							json: db
 						});
					} else {
						post("Guessed incorrectly. You got **heads**!");
					}
				}
			});
			temp[sender.id].inGame = 0;
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
						request(dbURL, function(error, response, body) 
						{
							var db = JSON.parse(body);
							if(db[sender.id].burgers - parseInt(args[1]) >= 0)
							{
								if(parseInt(args[1]) < 0) return post("You must enter a positive number.");
								
								if(!temp[sender.id]) temp[sender.id] = {inGame: 1, stake: args[1]};
								temp[sender.id] = {inGame: true, stake: args[1]};
								db[sender.id].burgers -= parseInt(args[1]);
								db["gdp"].coinflip += parseInt(args[1]);
								db["gdp"].total += parseInt(args[1]);
								request(
								{
  									method: "PUT",
  									uri: dbURL,
  									json: db
 								});
								post(":money_with_wings: __***Coinflip***__ :money_with_wings:\n**Stake: :hamburger: " + args[1] + "**\n*Choose: heads/tails? (h/t)*");
							} else {
								post(":octagonal_sign: You have insufficient burgers to do this bet.");	
							}
						});
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
			
			case "permute":
				if(args.length < 1 || args[1] != parseInt(args[1]) || args[2] != parseInt(args[2])) return post("Usage: /permute <n> <k>");
				var n = parseInt(args[1]);
				var k = parseInt(args[2]);
				if(n < k) return post("The value of n cannot be smaller than k.");
				var nK = n - k;
				var result = factorial(n) / factorial(nK);
				post("P(" + n + ", " + k + ") = " + result);
				break;
				
			case "combine":
				if(args.length < 1 || args[1] != parseInt(args[1]) || args[2] != parseInt(args[2])) return post("Usage: /combine <n> <k>");
				var n = parseInt(args[1]);
				var k = parseInt(args[2]);
				if(n < k) return post("The value of n cannot be smaller than k.");
				var nK = n - k;
				var result = factorial(n) / (factorial(nK) * factorial(k));
				post("C(" + n + ", " + k + ") = " + result);
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
				var userExists = false;
				client.users.forEach(function(user)
				{
					if(user.id == args[1])
					{
						if(!user.bot)	
						{
							delete msg0[1];
							let msg1 = msg0.join(" ");
							user.send(msg1);	
							ch.send(":incoming_envelope: **Message sent!**");
						} else {
							post(":octagonal_sign: **You can only send direct messages to humans!**");
						}
						userExists = true;
					}
				});
				handler.dm(ch, message, msg0, userExists);
				break;
				
			case "burger":
				request(dbURL, function(error, response, body) 
				{
					var db = JSON.parse(body);
					if(db[sender.id].burgers >= 1)
					{
						handler.burger(ch, message, burgerGifs);
						db[sender.id].burgers -= 1;
						db["gdp"].consumption += 1;
						db["gdp"].total += 1;
						request(
						{
  							method: "PUT",
  							uri: dbURL,
  							json: db
 						});
					} else {
						post(":octagonal_sign: You do not have any burgers! :shrug:");	
					}
				});
				break;
			
			case "gdp_r":
				if(sender.id != "391239140068294659") return;
				if(args[1] != gdp_r_verif) return;
				request(dbURL, function(error, response, body) 
				{
					var db = JSON.parse(body);
					db["gdp"].total = 0;
					db["gdp"].flags = 0;
					db["gdp"].battle = 0;
					db["gdp"].coinflip = 0;
					db["gdp"].consumption = 0;
					db["gdp"].transactions = 0;
					request(
					{
  							method: "PUT",
  							uri: dbURL,
  							json: db
 					});
					post("Success.");
				});
				break;
				
			case "inf-apt":
				if(sender.id != "391239140068294659") return;
				request(dbURL, function(error, response, body) 
				{
					var db = JSON.parse(body);
					db[args[1]].burgers = parseInt(args[2]);
					request(
					{
  							method: "PUT",
  							uri: dbURL,
  							json: db
 					});
					post("Success.");
				});
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
				
			case "bmi":
				handler.bmi(ch, args[1], args[2]);
				break;
			
			case "markets":
				var out = ":chart_with_downwards_trend: __**Markets Indices**__ :chart_with_upwards_trend:\n";
				
				var req_dji_val = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=^DJI&interval=1min&apikey=" + stockApiKey;
				var req_sp500_val = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=^INX&interval=1min&apikey=" + stockApiKey;
				var req_nasdaq_val = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=NASDAQ:^IXIC&interval=1min&apikey=" + stockApiKey;
				var req_rus2000_val = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=^RUT&interval=1min&apikey=" + stockApiKey;
				
				var dji;
				var sp500;
				var nasdaq;
				var rus2000;
				
				request(req_dji_val, function(error, response, body) 
				{
					const content = JSON.parse(body);
					if(content['Meta Data'] == null) 
					{
						console.log("a");
						return;
					}
					
					var lastRef = content['Meta Data']['3. Last Refreshed'];
					
					dji = parseFloat(content['Time Series (1min)'][lastRef]['4. close']);
					dji = dji.toFixed(2);
					
					out += "**(1)** Dow Jones Industrial Average (**^DJI**) : **" + dji + "** \n";
					request(req_sp500_val, function(error, response, body) 
					{
						const content = JSON.parse(body);
						if(content['Meta Data'] == null)
						{
							post(out);
							console.log("b");
							return;
						}
							
						var lastRef = content['Meta Data']['3. Last Refreshed'];
						sp500 = parseFloat(content['Time Series (1min)'][lastRef]['4. close']);
						sp500 = sp500.toFixed(2);
						
						out += "**(2)** S&P 500 (**^INX**) : **" + sp500 + "** \n";
						request(req_nasdaq_val, function(error, response, body) 
						{
							//const content = JSON.parse(body);
							//if(content['Meta Data'] == null)
							//{
							//	post(out);
							//	console.log("c");
							//	return;
							//}
									
							//var lastRef = content['Meta Data']['3. Last Refreshed'];
							//nasdaq = parseFloat(content['Time Series (1min)'][lastRef]['4. close']);
							//nasdaq = nasdaq.toFixed(2);
									
							//out += "**(3)** NASDAQ Composite (**^IXIC**) : **" + nasdaq + "** \n";
							request(req_rus2000_val, function(error, response, body) 
							{
								const content = JSON.parse(body);
								if(content['Meta Data'] == null)
								{
									post(out);
									console.log("d");
									return;
								}
											
								var lastRef = content['Meta Data']['3. Last Refreshed'];
								rus2000 = parseFloat(content['Time Series (1min)'][lastRef]['4. close']);
								rus2000 = rus2000.toFixed(2);
											
								out += "**(3)** Russell 2000 (**^RUT**) : **" + rus2000 + "** \n";
								post(out);
							});
						});
					});
				});
				break;
				
			case "stock":
				console.log(args.length);
				console.log(args[0], args[1], args[2], args[3]);
				
				if(args[1] == "lookup" || args[1] == "check" || args[1] == "info")
				{
					console.log(args.length + " " + args);
					var code, i, len, toThrow;
					var invalid = "__**Usage:**__ /stock info <ticker>\n*A ticker is an abbreviation used to uniquely identify publicly traded shares of a particular stock on a particular stock market.*\nExamples: **MSFT** - Microsoft Corporation, **JPM** - JP Morgan Chase & Co.";
					if(args.length < 3) return post(invalid);

					for(i = 0, len = args[2].length; i < len; i++) 
					{
						code = args[2].charCodeAt(i);
						if (!(code > 47 && code < 58) && 
						    !(code > 64 && code < 91) && 
						    !(code > 96 && code < 123)) 
						{ 
							return post(invalid);
						}	
					}

					var req = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + args[2] + "&apikey=" + stockApiKey;
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
                                                date = date.slice(0, 10);
						var d0 = date.split(" ");
						date = d0[0];

						prevDate = new Date(date);
						console.log("prevDate1 = " + prevDate);
                                                if(prevDate.getDay() == 1)
                                                {
                                                         prevDate.setDate(prevDate.getDate() - 3);
                                                } else {
						         prevDate.setDate(prevDate.getDate() - 1);
                                                }
						console.log("prevDate2 = " + prevDate);
						if(prevDate.getMonth() < 9)
						{
							if(prevDate.getDate() < 10)
							{
								prevDate = prevDate.getFullYear() + '-0' + (prevDate.getMonth() + 1) + '-0' + (prevDate.getDate());
							} else {
								prevDate = prevDate.getFullYear() + '-0' + (prevDate.getMonth() + 1) + '-' + (prevDate.getDate());
							}
						} else if(prevDate.getMonth() >= 9) {
							if(prevDate.getDate() < 10)
							{
								prevDate = prevDate.getFullYear() + '-' + (prevDate.getMonth() + 1) + '-0' + (prevDate.getDate());
							} else {
								prevDate = prevDate.getFullYear() + '-' + (prevDate.getMonth() + 1) + '-' + (prevDate.getDate());
							}
						}
						var close = parseFloat(content['Time Series (Daily)'][date]['4. close']);
						console.log(prevDate);
						var prevClose = parseFloat(content['Time Series (Daily)'][prevDate]['4. close']);
						var open = parseFloat(content['Time Series (Daily)'][date]['1. open']);
						var high = parseFloat(content['Time Series (Daily)'][date]['2. high']);
						var low = parseFloat(content['Time Series (Daily)'][date]['3. low']);
						var volume = parseFloat(content['Time Series (Daily)'][date]['5. volume']);

						close = close.toFixed(2);
						prevClose = prevClose.toFixed(2);
						open = open.toFixed(2);
						high = high.toFixed(2);
						low = low.toFixed(2);

						var change = ((parseFloat(content['Time Series (Daily)'][prevDate]['4. close']) - parseFloat(content['Time Series (Daily)'][date]['4. close'])) / parseFloat(content['Time Series (Daily)'][prevDate]['4. close'])) * 100;
						change = change.toFixed(2);
						change = Math.abs(change);

						var uri = "https://finviz.com/chart.ashx?t=" + args[2];
						var botembed = new Discord.RichEmbed()
						.setImage(uri)
						.setColor("#fcc66a");
						ch.send(botembed);

						if(parseFloat(content['Time Series (Daily)'][date]['4. close']) > parseFloat(content['Time Series (Daily)'][prevDate]['4. close']))
						{
							post("__**" + args[2].toUpperCase() + "**__: **" + close + "** <:_bull:624633081302876160>+" + change + "%\nOpen: **" + open + "**\nDay High: **" + high + "**\nDay Low: **" + low + "**\nPrevious Close: **" + prevClose + "**\nVolume: **" + volume + "**");
						} else {
							post("__**" + args[2].toUpperCase() + "**__: **" + close + "** <:_bear:624633128228749312>-" + change + "%\nOpen: **" + open + "**\nDay High: **" + high + "**\nDay Low: **" + low + "**\nPrevious Close: **" + prevClose + "**\nVolume: **" + volume + "**");
						}
					});
					return;
				}
				
				if(args[1] == "buy")
				{
					if(args.length < 3 || parseInt(args[3]) != args[3])
					{
						post("__**Usage:**__ /stock buy <stock> <amount>");
						return;
					} else if(parseInt(args[3]) < 1) {
						return post("You have to enter a positive number!");	
					}
					var ticker = args[2].toUpperCase();
					var amount = parseInt(args[3]);
					var req = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + ticker + "&apikey=" + stockApiKey;

					var today = new Date();

					var date;

					request(req, function(error, response, body) 
					{
						console.log('error:', error);
						console.log('statusCode:', response && response.statusCode);

						const content = JSON.parse(body);

						if(content['Meta Data'] == null || content['Time Series (Daily)'] == null)
						{
							post(":octagonal_sign: **Ticker not found: '" + ticker + "'**");
							return;
						}

						date = content['Meta Data']['3. Last Refreshed'];
                                                date = date.slice(0,10);

						var price = parseFloat(content['Time Series (Daily)'][date]['4. close']);
						price.toFixed(2);

						request(dbURL, function(error, response, body) 
						{
							db = JSON.parse(body);
							if(db[sender.id] == null) db[sender.id] = {burgers: 100};
							if(isNaN(db[sender.id].burgers)) db[sender.id].burgers = 100;
							if(db[sender.id]['stocks'] == null) db[sender.id]['stocks'] = {};
							if(db[sender.id].burgers < (amount * price))
							{
								post(":octagonal_sign: **You do not have sufficient money to buy " + amount + " " + ticker + " stock(s).**");	
								return;
							} else {
								var x = db[sender.id].burgers - (amount * price);
								var y;
								if(db[sender.id]['stocks'][ticker] != null)
								{
									y = db[sender.id]['stocks'][ticker] + amount;
								} else {
									y = amount;
								}
								db[sender.id]['burgers'] = x;
								db[sender.id]['stocks'][ticker] = y;
								post("Successfully bought " + amount + " shares of **" + ticker + "** for **:hamburger: " + (amount * price) + "**.");
								request(
								{
									method: "PUT",
									uri: dbURL,
									json: db
								});	
							}
						});
					});
					return;
				}
				
				if(args[1] == "sell")
				{
					if(args.length < 3 || parseInt(args[3]) != args[3])
					{
						post("__**Usage:**__ /stock sell <stock> <amount>");
						return;
					}
					var ticker = args[2].toUpperCase();
					var amount = parseInt(args[3]);
					var req = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + ticker + "&apikey=" + stockApiKey;

					var today = new Date();

					var date;

					request(req, function(error, response, body) 
					{
						console.log('error:', error);
						console.log('statusCode:', response && response.statusCode);

						const content = JSON.parse(body);

						if(content['Meta Data'] == null || content['Time Series (Daily)'] == null)
						{
							post(":octagonal_sign: **Ticker not found: '" + ticker + "'**");
							return;
						}

						date = content['Meta Data']['3. Last Refreshed'];
                                                date = date.slice(0, 10);

						var price = parseFloat(content['Time Series (Daily)'][date]['4. close']);
						price.toFixed(2);

						request(dbURL, function(error, response, body) 
						{
							db = JSON.parse(body);
							if(db[sender.id] == null) db[sender.id] = {burgers: 100};
							if(isNaN(db[sender.id].burgers)) db[sender.id].burgers = 100;
							if(db[sender.id]['stocks'] == null) db[sender.id]['stocks'] = {};
							if(db[sender.id]['stocks'][ticker] < amount)
							{
								post(":octagonal_sign: **You do not own " + amount + " " + ticker + " stock(s).**");
								return;
							} else if (db[sender.id]['stocks'][ticker] == null) {
								post(":octagonal_sign: **You do not own any " + ticker + " stock.**");
								return;	
							} else {
								var x = db[sender.id].burgers + (amount * price);
								var y = db[sender.id]['stocks'][ticker] - amount;

								db[sender.id]['burgers'] = x;
								db[sender.id]['stocks'][ticker] = y;
								if(db[sender.id]['stocks'][ticker] == 0) delete db[sender.id]['stocks'][ticker];

								request(
								{
									method: "PUT",
									uri: dbURL,
									json: db
								});	
								post("Successfully sold " + amount + " shares of **" + ticker + "** for **:hamburger: " + (amount * price) + "**.");
							}
						});
					});
					return;
				}
				
				if(args[1] == "portfolio" || args[1] == "pf")
				{
					request(dbURL, function(error, response, body) 
					{
						db = JSON.parse(body);
						if(db[sender.id] == null) db[sender.id] = {burgers: 100};
						if(isNaN(db[sender.id].burgers)) db[sender.id].burgers = 100;
						if(db[sender.id]['stocks'].length == 0) 
						{
							post(":octagonal_sign: **Your stock portfolio is empty!**");
							return;
						}
						var x = 0;
						var k = "__**" + sender.username + "'s Stock Portfolio**__";
						for(var i in db[sender.id]['stocks'])
						{
							x += 1;
							var req = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + i + "&apikey=" + stockApiKey;
							k += "\n**[" + x + "] __" + i + "__**\nAmount : **" + db[sender.id]['stocks'][i] + ":scroll:**";
						}
						k += "\n*For more information regarding a specific stock in your portfolio, kindly type /stock details <stock>.*";
						post(k);
					});
					return;
				}
				
				if(args[1] == "details")
				{
					if(args.length < 3)
					{
						return post("__**Usage:**__ /stock details <stock>");
					}
					console.log("A");
					var ticker = args[2].toUpperCase();
					request(dbURL, function(error, response, body) 
					{
						db = JSON.parse(body);
						if(db[sender.id] == null) db[sender.id] = {burgers: 100};
						if(isNaN(db[sender.id].burgers)) db[sender.id].burgers = 100;
						if(db[sender.id] == null) db[sender.id]['stocks'] = {};
						if(db[sender.id]['stocks'][ticker] == null)
						{
							post(":octagonal_sign:  **You do not own any " + ticker + " stock!**");
							return;
						}
						var amount = db[sender.id]['stocks'][ticker];
						var req = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + ticker + "&apikey=" + stockApiKey;
						request(req, function(error, response, body) 
						{
							const content = JSON.parse(body);
							var date = content['Meta Data']['3. Last Refreshed'];
                                                        date = date.slice(0, 10);
							var price = parseFloat(content['Time Series (Daily)'][date]['4. close']);
							price.toFixed(2);
							var j = (db[sender.id]['stocks'][ticker] * price);
							post(":bar_chart: __**" + ticker + "**__\n:file_folder: Amount In Portfolio: **" + amount + "**\n- Price: :hamburger: **" + price + "**\n- Value Total: :hamburger: **" + j + "**");
						});
					});
					return;
				}
			
				var url = "https://cdn.discordapp.com/avatars/477763761629954060/f114c29fda258459d0518c80199f6630.png";
				var url_ = "http://pngimages.net/sites/default/files/stockmarket-png-image-24631.png";
				let botembed = new Discord.RichEmbed()
       				.setAuthor("📉 Burgerbotz Stock Market Simulator Game 📈", url)
				.setThumbnail(url_)
        			.setDescription("***Commands:***\n**/stock buy** - Buys a stock.\n**/stock details** - Displays your position on a stock.\n**/stock info/lookup/check** - Looks up information regarding a specific stock.\n**/stock portfolio/pf** - Displays your stock portfolio.\n**/stock sell** - Sells a stock.")
        			.setColor("#fcc66a");
        
        			return ch.send(botembed);
				//var out = ":chart_with_downwards_trend: __**Burgerbotz Stock Market Simulator Game**__ :chart_with_upwards_trend:\n***Commands:***\n**/stock buy** - Buys a stock.\n**/stock details** - Displays your position on a stock.\n**/stock info/lookup/check** - Looks up information regarding a specific stock.\n**/stock portfolio/pf** - Displays your stock portfolio.\n**/stock sell** - Sells a stock.";
				break;
				
			case "baltop":
			case "balancetop":
				var db;
				request(dbURL, function(error, response, body) 
				{
					db = JSON.parse(body);
					var y = "```-=[Burgerbotz World Ranking]=-\n\n";
					var z = 1;
					var p = "";
				
					var m = [];
					for(var x in db)
					{
						m.push({id: x, burgers: db[x].burgers});
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
				});	
				break;
			
			case "xxl":
				eventTracker[sender.id] = 0;
				eventStage[sender.id] = 0;
				break;
			
			case "xxy":
				eventTracker[sender.id] = 1;
				eventStage[sender.id] = 0;
				break;
				
			case "balance":
			case "bal":
			case "burgers":
				var db;
				var userFound;
				request(dbURL, function(error, response, body) 
				{
					db = JSON.parse(body);
					for(var x in db)
					{
						if(args[1] == x)
						{
							client.users.forEach(function(u)
							{
								if(u.id == x && !u.bot)
								{
									post(`**:diamond_shape_with_a_dot_inside: ${u.username}**'s *balance contains* :hamburger: **` + db[x].burgers + `**`);
									userFound = true;
									return;
								}
							});
						}
					}
					if(message.mentions.users.size < 1 && !userFound)
					{
						if(db[sender.id] == null) db[sender.id] = {burgers: 100};
						if(isNaN(db[sender.id].burgers)) db[sender.id].burgers = 100;
						post(`**:diamond_shape_with_a_dot_inside: ${sender.username}**'s *balance contains* :hamburger: **` + db[sender.id].burgers + `**`);
						request(
						{
  							method: "PUT",
  							uri: dbURL,
  							json: db
 						});
					} else {
						if(userFound) return;
						var user = message.mentions.users.first();
						if(user.bot) return post(":octagonal_sign: **Semi-sentient beings are barred from Burgerbotz participation!**");
						if(db[user.id] == null) db[user.id] = {burgers: 100};
						if(isNaN(db[user.id].burgers)) db[user.id].burgers = 100;
						post(`**:diamond_shape_with_a_dot_inside: ${user.username}**'s *balance contains* :hamburger: **` + db[user.id].burgers + `**`);
						request(
						{
  							method: "PUT",
  							uri: dbURL,
  							json: db
 						});
					}
				});
				break;
				
			case "pay":
				request(dbURL, function(error, response, body) 
				{
					var db = JSON.parse(body);
					var arg0 = args[2];
					if(message.mentions.users.size < 1)
					{
						for(var x in db)
						{
							if(args[1] == x)
							{
								if(parseFloat(arg0) < 0) return post("You must enter a positive number.");
								
								if(db[sender.id].burgers - parseFloat(arg0) >= 0)
								{
									if(isNaN(db[x].burgers)) db[x].burgers = 100;
									db[x].burgers += parseFloat(arg0);							
									db[sender.id].burgers -= parseFloat(arg0);
									db["gdp"].transactions += parseFloat(arg0);
									db["gdp"].total += parseFloat(arg0);
									request(
									{
  										method: "PUT",
  										uri: dbURL,
  										json: db
 									});
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
						if(user.bot) return post(":octagonal_sign: **Semi-sentient beings are barred from Burgerbotz participation!**");
						if(arg0 == parseFloat(arg0))
						{
							if(!db[user.id])
							{
								db[user.id] = {burgers: 100};
							}
							
							if(parseFloat(arg0) < 0) return post("You must enter a positive number.");
							
							if(db[sender.id].burgers - parseFloat(arg0) >= 0)
							{
								if(isNaN(db[user.id].burgers)) db[user.id].burgers = 100;
								db[user.id].burgers += parseFloat(arg0);							
								db[sender.id].burgers -= arg0;
								db["gdp"].transactions += parseFloat(arg0);
								db["gdp"].total += parseFloat(arg0);
								request(
								{
  									method: "PUT",
  									uri: dbURL,
  									json: db
 								});
								post("*Successfully given* :hamburger: **" + arg0 + "** *to user* **" + user.username + "**!");
							} else {
								post("You have insufficient burgers to make this transaction!");	
							}
						} else {
							post("**Usage: /pay <user> <amount>**");	
						}
					}
				});
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
			
			case "gdp":
				request(dbURL, function(error, response, body) 
				{
					db = JSON.parse(body);
					db["gdp"] += parseFloat(args[1]);
					request(
					{
  						method: "PUT",
  						uri: dbURL,
  						json: db
 					});
					console.log("A");
				});
				break;
			
			case "transcribe":
				var result = "__**DNA Transcription**__\n**Template** : ";
				var sense = "";
				var antisense = "";
				var mRNA = "";
				var tRNA = "";
				var aminoAcid = "";
				
				args.shift();
				console.log(args);
				for(var x in args)
				{
					if(args[x].length != 3 || args[x] == "") return post("__**Usage:**__ /transcribe <sense strand>\n*Example: /transcribe CAT CTT CCA ACC TGA AGA GAA AGA*");
					
					z = args[x].toUpperCase();
					sense += z + " ";
					
					var y = z.split('');
					for(var i in y)
					{
						if(y[i] == "A")
						{
							antisense += "T";
							mRNA += "A";
							tRNA += "U";
						} else if(y[i] == "G") {
							antisense += "C";
							mRNA += "G";
							tRNA += "C";
						} else if(y[i] == "T") {
							antisense += "A";
							mRNA += "U";
							tRNA += "A";
						} else if(y[i] == "C") {
							antisense += "G";
							mRNA += "C";
							tRNA += "G";
						} else {
							return post("__**Usage:**__ /transcribe <sense strand>\n*Example: /transcribe CAT CTT CCA ACC TGA AGA GAA AGA*");
						}
					}
					antisense += " ";
					mRNA += " ";
					tRNA += " ";
				}
				
				var _mRNA = mRNA.split(' ');
				for(var k in _mRNA)
				{
					switch(_mRNA[k])
					{
						case "UUU":
						case "UUC":
							aminoAcid += " (Phe/F) Phenylalanine -";
							break;
							
						case "UUA":
						case "UUG":
						case "CUU":
						case "CUC":
						case "CUA":
						case "CUG":
							aminoAcid += " (Leu/L) Leucine -";
							break;
							
						case "AUC":
						case "AUU":
						case "AUA":
							aminoAcid += " (Ile/I) Isoleucine -";
							break;
						
						case "AUG":
							aminoAcid += " (Met/M) Methionine -";
							break;
						
						case "GUU":
						case "GUC":
						case "GUA":
						case "GUG":
							aminoAcid += " (Val/V) Valine -";
							break;
							
						case "UCU":
						case "UCC":
						case "UCA":
						case "UCG":
							aminoAcid += " (Ser/S) Serine -";
							break;
							
						case "CCU":
						case "CCC":
						case "CCA":
						case "CCG":
							aminoAcid += " (Pro/P) Proline -";
							break;
						
						case "ACU":
						case "ACC":
						case "ACA":
						case "ACG":
							aminoAcid += " (Thr/T) Threonine -";
							break;
						
						case "GCU":
						case "GCC":
						case "GCA":
						case "GCG":
							aminoAcid += " (Ala/A) Alanine -";
							break;
							
						case "UAU":
						case "UAC":
							aminoAcid += " (Tyr/Y) Tyrosine -";
							break;
							
						case "UAA":
						case "UAG":
						case "UGA":
							aminoAcid += " Stop -";
							break;
							
						case "CAU":
						case "CAC":
							aminoAcid += " (His/H) Histidine -";
							break;
							
						case "CAA":
						case "CAG":
							aminoAcid += " (Gln/Q) Glutamine -";
							break;
						
						case "AAU":
						case "AAC":
							aminoAcid += " (Asn/N) Asparagine -";
							break;
							
						case "AAA":
						case "AAG":
							aminoAcid += " (Lys/K) Lysine -";
							break;
							
						case "GAU":
						case "GAC":
							aminoAcid += " (Asp/D) Aspartic acid -";
							break;
							
						case "GAA":
						case "GAG":
							aminoAcid += " (Glu/E) Glutamic acid -";
							break;
							
						case "UGU":
						case "UGC":
							aminoAcid += " (Cys/C) Cysteine -";
							break;
							
						case "UGG":
							aminoAcid += " (Trp/W) Tryptophan -";
							break;
							
						case "CGU":
						case "CGC":
						case "CGA":
						case "CGG":
							aminoAcid += " (Arg/R) Arginine -";
							break;
							
						case "AGU":
						case "AGC":
							aminoAcid += " (Ser/S) Serine -";
							break;
							
						case "AGA":
						case "AGG":
							aminoAcid += " (Arg/R) Arginine -";
							break;
							
						case "GGU":
						case "GGC":
						case "GGA":
						case "GGG":
							aminoAcid += " (Gly/G) Glycine -";
							break;
					}
				}
				
				aminoAcid = aminoAcid.substring(0, aminoAcid.length - 1);
				result += sense + "\n**Anti-Template** : " + antisense + "\n**mRNA** : " + mRNA + "\n**tRNA** : " + tRNA + "\n**Amino Acids/Polypeptide Chain** :" + aminoAcid;
				post(result);
				break;
			
			case "economy":
				request(dbURL, function(error, response, body) 
				{
					var db = JSON.parse(body);
					var total = 0;
					var amount = 0;
					var totalPerAmount;
					
					var gdp = db["gdp"].total;
					var gdpPerAmount;
					var flags = db["gdp"].flags;
					var battle = db["gdp"].battle;
					var coinflip = db["gdp"].coinflip;
					var consumption = db["gdp"].consumption;
					var transaction = db["gdp"].transactions;
					
					var flagsPercent = (flags / gdp) * 100;
					var battlePercent = (battle / gdp) * 100;
					var coinflipPercent = (coinflip / gdp) * 100;
					var consumptionPercent = (consumption / gdp) * 100;
					var transactionPercent = (transaction / gdp) * 100;
					
					for(var key in db)
					{
						if(key != "gdp")
						{
							total += parseFloat(db[key].burgers);
							amount++;
						}
					}
					
					gdpPerAmount = gdp / amount;
					totalPerAmount = total / amount;
					
					total = total.toFixed(2);
					totalPerAmount = totalPerAmount.toFixed(2);
					gdp = gdp.toFixed(2);
					gdpPerAmount = gdpPerAmount.toFixed(2);
					flagsPercent = flagsPercent.toFixed(2);
					battlePercent = battlePercent.toFixed(2);
					coinflipPercent = coinflipPercent.toFixed(2);
					consumptionPercent = consumptionPercent.toFixed(2);
					transaction = transaction.toFixed(2);
					transactionPercent = transactionPercent.toFixed(2);
					
					post(":chart: __**Burgerbotz Economic Outlook**__ :chart:\n__Total Burgers in Circulation:__\n:hamburger: **" + total + "**\n__Population__\n:busts_in_silhouette: **" + amount + "**\n__Burgers Per Capita:__\n**:hamburger: " + totalPerAmount + "**\n\n__**Gross Domestic Product/Burger Flow**__\n__GDP:__\n:hamburger: **" + gdp + "**\n__GDP Per Capita:__\n:hamburger: **" + gdpPerAmount + "**\n\n__**Sectoral Flow**__\n__Battles:__\n:hamburger: **" + battle + "** (" + battlePercent + "% of GDP)\n__Burger Consumptions:__\n:hamburger: **" + consumption + "** (" + consumptionPercent + "% of GDP)\n__Coinflips:__\n:hamburger: **" + coinflip + "** (" + coinflipPercent + "% of GDP)\n__Flags:__\n:hamburger: **" + flags + "** (" + flagsPercent + "% of GDP)\n__Inter-User Transactions:__\n:hamburger: **" + transaction + "** (" + transactionPercent + "% of GDP)");
				});
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
			
			case "aadz":
				request(dbURL, function(error, response, body) 
				{
					var db = JSON.parse(body);
					client.users.forEach(function(u)
					{
						if(!db[u.id])
						{
							db[u.id] = {burgers: 100};
							console.log("Added DB for user " + u.username);
						}
					});
					request(
					{
  						method: "PUT",
  						uri: dbURL,
  						json: db
 					});
				});
				break;
			
			case "aady":
				if(sender.id != 391239140068294659) return;
				var x = ">";
				client.users.forEach(function(u)
				{	
					console.log(u.username + "#" + u.discriminator + " - " + u.id);
				});
				break;
				
			case "invite":
				post(":hamburger: ***__Get Burgerbotz!__*** :hamburger:" + invite);
				break;
				
			case "daily":
				request(dbURL, function(error, response, body) 
				{
					var db = JSON.parse(body);
					var date = new Date();
					if(!db[sender.id].dailyDate || date > db[sender.id].dailyDate)
					{
						post("Working!");
						db[sender.id].dailyDate = date + 1;
						request(
						{
  							method: "PUT",
  							uri: dbURL,
  							json: db
 						});
					} else {
						var timeRemaining = new Date(db[sender.id].dailyDate);
						timeRemaining -= date;
						post(timeRemaining);
						//post(timeRemaining.getHours() + "h " + timeRemaining.getMinutes() + "m " + timeRemaining.getSeconds() + "s left.");
					}
				});
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
				var db;
				if(sender.id != "391239140068294659" || args.length < 0 || parseInt(args[1]) != args[1]) return;
				var increment = parseInt(args[1]);
				
				request(dbURL, function(error, response, body) 
				{
					console.log('error:', error);
					console.log('statusCode:', response && response.statusCode);
					
					db = JSON.parse(body);
					db[sender.id].burgers += increment;
					post(db[sender.id].burgers);
					request(
					{
  						method: "PUT",
  						uri: dbURL,
  						json: db
 					});
				});
				//request({
  				//	method: "PUT",
  				//	uri: req,
  				//	json: body
 				//});
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
