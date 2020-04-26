const Discord = require('discord.js');
const fs = require('fs');
const request = require('request');
const unst = require('./storage/unstatics.js');
const handler = require('./CommandHandler.js');
const randomEvents = require('./RandomEvents.js');

const opusscript = require('opusscript');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

const dbURL = process.env.DB_URL;
const dbKey = process.env.DB_KEY;

const status = "/help";
const stockApiKey = "4MAQ744ZHW6LDYAK";

const getOptions = 
{
	url: 'https://api.jsonbin.io/b/5e9de3022940c704e1db9a3a',
	headers: {
		'secret-key': dbKey
	},
	method: 'GET'
};

var database = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
var temp = JSON.parse(fs.readFileSync('temp.json', 'utf8'));
var phoneRoom = {"x": "y"};
var indices = {"x": "y"};
var inviteObjects = {"x": 0};

var eventTracker = {"x": 0};
var eventStage = {"x": 0};

var raceTracker = {"x": 0};
var raceAmount = {"x": 0};

var raceOpt1 = {"x": "y"};
var raceOpt2 = {"x": "y"};
var raceOpt3 = {"x": "y"};

var battleChannels = {"x": 0};  	 // ChannelID : Turn ID <- 0-1
var battleRequests = {"x": 0};  	 // ChannelID : InRequest ID <- 0-1
var battlePairs = {"x": "y"};     	 // Player 1 ID : Player 2 ID
var battlePairsMirror = {"x": "y"};      // Player 2 ID : Player 1 ID
var battlePairNames = {"x": "y"}; 	 // Player 1 Username : Player 2 Username 
var battlePairNamesMirror = {"x": "y"};  // Player 2 Username : Player 1 Username
var requestTo = {"x": 0};       	 // RequestTo ID : 0-1
var playerOnes = {"x": 0};          	 // IDs of every player 1s
var playerTwos = {"x": 0};          	 // IDs of every player 2s
var isCrippled = {"x": 0};                  // IDs of every crippled player
var isF0 = {"x": 0};                     // Whether F0 is true in channel

var hqChannel;
var joinChannel, leaveChannel, mainChannel, logChannel;

var musicServers = {};

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
			if(channel.id === "656845623345020988") 
			{
				logChannel = channel;	
			}
		});
		
		var invites = guild.fetchInvites().then(invite => 
		{
				var invArr = invite.array();
				for(i = 0; i < invArr.length; i++)
				{
					var inv = invArr[i];
					//var no = i + 1;
					//message.channel.send("[" + no + "] " + inv.uses + " - " + inv.inviter.username + " - " + inv.code);
					inviteObjects[inv.code] = inv.uses;
					console.log("Compiled " + inv.code + " into inviteObjects.");
				}
		}).catch(console.error);
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
		console.log(joinChannel.id);
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

function flipTurn(turn)
{
	if(turn == 0)
	{
		return 1;	
	} else if(turn == 1) {
		return 0;	
	}
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
		let sender = message.author;
		let ch = message.channel;
		
		if(!handler.isOldEnough(sender)) return;
	
		request(getOptions, function(error, response, body) 
		{
			if(!body) return;
			var db = JSON.parse(body);
			if(!db[sender.id]) 
			{
				db[sender.id] = {burgers: 10};
				if(!db[sender.id].reputation) db[sender.id].reputation = 50;
				if(!db[sender.id]['ratings']) db[sender.id]['ratings'] = {};
				console.log("Created new DB data for user: " + sender.username + "#" + sender.discriminator);
				updateDB(db);
			}
		});
		
		var msg0 = message.content.split(' ');
		var cmd0 = msg0[0];
		var cmd = "";
	
		delete msg0[0];
		var arg = msg0.join(" ");
		
		var msg = message.content.toLowerCase();
		const args = msg.slice(prefix.length).trim().split(/ +/g);
		const _args = message.content.split(' ');
	
		var randomEventOccurring = randomize(0, 250);
		if(randomEventOccurring == 10) 
		{
			if(sender.bot) return;
			var eventRandomizer = randomize(0, 6);
			eventTracker[sender.id] = eventRandomizer;
			eventStage[sender.id] = 0;
		}
		
		var date = message.createdAt;
	
		if(message.channel.type == "text")
		{
			if(message.guild.id == "613500872839921675")
			{

				var template = "discord.gg/";
				if(message.content.toLowerCase().includes(template))
				{
					for(i = 0; i < _args.length; i++)
					{
						if(_args[i].toLowerCase().includes(template) || _args[i].toLowerCase().startsWith(template))	
						{
							var l = _args[i].length;
							var code;

							if(_args[i].toLowerCase().startsWith('https'))
							{
								code = _args[i].substr(19, (l - 1));
							} else if(_args[i].toLowerCase().startsWith('http')) {
								code = _args[i].substr(18, (l - 1));
							} else if(_args[i].toLowerCase().startsWith('d')) {
								code = _args[i].substr(11, (l - 1));
							}

							client.fetchInvite(code).then(function(invite)
							{
								if(invite.guild.name != null)
								{
									message.delete().then(function(msx)
									{
										logChannel.send("Deleted invite posted by **" + sender.username + "#" + sender.discriminator + "** (" + invite.code + ") to **" + invite.guild.name + "**.");
										sender.send(":warning: **Do not post Discord invite links onto the " + message.guild.name + " server.**");
									});
								}
							});	
						}
					}
				}
			}
		}
		
		for(var key in eventTracker)
		{
			if(key == message.author.id)
			{
				if(playerOnes[sender.id] || playerTwos[sender.id] || (temp[sender.id] && temp[sender.id].inGame == 1)) return;
				var repChange = 0;
				if(eventTracker[key] == 0)
				{
					var value = randomize(1, 25);
					if(eventStage[key] == 0)
					{
						randomEvents.call(ch, sender, 0, 0, value, repChange);
						eventStage[key] = 1;
					} else if(eventStage[key] == 1) {
						var stage;
						if(message.content.startsWith("1"))
						{
							stage = randomize(1, 3);
							randomEvents.call(ch, sender, 0, stage, value, repChange);	
						} else if(message.content.startsWith("2")) {
							stage = randomize(3, 5);
							randomEvents.call(ch, sender, 0, stage, value, repChange);	
						} else if(message.content.startsWith("3")) {
							randomEvents.call(ch, sender, 0, 5, value, repChange);	
						} else {
							return;	
						}
						
						delete eventTracker[key];
						delete eventStage[key];
						
						if(stage == 1 || stage == 3) return;
						
						request(getOptions, function(error, response, body) 
						{
							db = JSON.parse(body);
							db[message.author.id].burgers -= value;
							if(db[message.author.id].burgers < 0) db[message.author.id].burgers = 0;
							updateDB(db);
						});
					}
				} else if(eventTracker[key] == 1) {
					var value = randomize(5, 250);
					var fine = randomize(5, 50);
					if(eventStage[key] == 0)
					{
						randomEvents.call(ch, sender, 1, 0, 0, repChange);
						eventStage[key] = 1;
					} else if(eventStage[key] == 1) {
						var stage;
						if(message.content.startsWith("1"))
						{
							stage = randomize(1, 4);
							if(stage == 3)
							{
								randomEvents.call(ch, sender, 1, stage, fine, repChange);
							} else {
								console.log(stage);
								randomEvents.call(ch, sender, 1, stage, value, repChange);	
							}
						} else if(message.content.startsWith("2")) {
							stage = 4;
							randomEvents.call(ch, sender, 1, 4, value, repChange);	
						} else if(message.content.startsWith("3")) {
							stage = randomize(5, 7);
							if(stage == 6) randomEvents.call(ch, sender, 1, stage, value, repChange);
						} else {
							return;	
						}
						delete eventTracker[key];
						delete eventStage[key];
						
						if(stage == 2 || stage == 4 || stage == 6) return;
						
						request(getOptions, function(error, response, body) 
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
									randomEvents.call(ch, sender, 1, stage, (value / 2), repChange);	
									db[message.author.id].burgers += value / 2;
								} else if(tip == 1) {
									randomEvents.call(ch, sender, 1, stage, value, repChange);	
									db[message.author.id].burgers += value;
								} else if(tip == 2) {
									randomEvents.call(ch, sender, 1, stage, (value * 2), repChange);	
									db[message.author.id].burgers += value * 2;
								}
							}
							if(db[message.author.id].burgers < 0) db[message.author.id].burgers = 0;
							updateDB(db);
						});
					}
				} else if(eventTracker[key] == 2) {
					var value = randomize(20, 100);
					if(eventStage[key] == 0)
					{
						randomEvents.call(ch, sender, 2, 0, value, repChange);
						eventStage[key] = 1;
					} else if(eventStage[key] == 1) {
						var stage;
						if(message.content.startsWith("1"))
						{
							stage = randomize(1, 4);
							randomEvents.call(ch, sender, 2, stage, value, repChange);	
						} else if(message.content.startsWith("2")) {
							stage = 4;
							randomEvents.call(ch, sender, 2, 4, value, repChange);	
						} else {
							return;	
						}
						
						delete eventTracker[key];
						delete eventStage[key];
						
						if(stage == 2 || stage == 4) return;
						
						request(getOptions, function(error, response, body) 
						{
							if(!body) return;
							db = JSON.parse(body);
							db[message.author.id].burgers -= value;
							if(db[message.author.id].burgers < 0) db[message.author.id].burgers = 0;
							updateDB(db);
						});
					}
				} else if(eventTracker[key] == 3) {
					var value = randomize(1, 15);
					if(eventStage[key] == 0)
					{
						randomEvents.call(ch, sender, 3, 0, value, repChange);
						eventStage[key] = 1;
					} else if(eventStage[key] == 1) {
						var stage;
						if(message.content.startsWith("1"))
						{
							stage = randomize(1, 3);
							randomEvents.call(ch, sender, 3, stage, value, repChange);	
						} else if(message.content.startsWith("2")) {
							stage = 3;
							randomEvents.call(ch, sender, 3, 3, value, repChange);	
						} else if(message.content.startsWith("3")) {
							stage = randomize(4, 9);
							randomEvents.call(ch, sender, 3, stage, value, repChange);
						} else {
							return;	
						}
						
						delete eventTracker[key];
						delete eventStage[key];
						
						if(stage == 3 || stage == 6 || stage == 8) return;
						
						request(getOptions, function(error, response, body) 
						{
							if(!body) return;
							db = JSON.parse(body);
							if(stage == 1 || stage == 5)
							{
								db[message.author.id].burgers -= value;
							} else if(stage == 2 || stage == 4 || stage == 7) {
								db[message.author.id].burgers += value;	
							}
							if(db[message.author.id].burgers < 0) db[message.author.id].burgers = 0;
							updateDB(db);
						});
					}
				} else if(eventTracker[key] == 4) {
					var value = 0;
					if(eventStage[key] == 0)
					{
						randomEvents.call(ch, sender, 4, 0, value, repChange);
						eventStage[key] = 1;
					} else if(eventStage[key] == 1) {
						var stage;
						if(message.content.startsWith("1"))
						{
							value = randomize(1, 25);
							stage = randomize(1, 4);
							if(stage == 1)
							{
								repChange = randomize(4, 10);
							} else if(stage == 2) {
								repChange = randomize(2, 8);	
							} else if(stage == 3) {
								repChange = randomize(-10, -4);
							}
							randomEvents.call(ch, sender, 4, stage, value, repChange);	
						} else if(message.content.startsWith("2")) {
							stage = 4;
							randomEvents.call(ch, sender, 4, 4, value, repChange);	
						} else if(message.content.startsWith("3")) {
							value = randomize(5, 30);
							stage = randomize(5, 8);
							if(stage == 5)
							{
								repChange = randomize(1, 5);
							} else if(stage == 6) {
								repChange = randomize(-2, 0);	
							} else {
								repChange = randomize(-15, -4);	
							}
							randomEvents.call(ch, sender, 4, stage, value, repChange);	
						} else {
							return;	
						}
						
						delete eventTracker[key];
						delete eventStage[key];
						
						if(stage == 4) return;
						
						request(getOptions, function(error, response, body) 
						{
							if(!body) return;
							db = JSON.parse(body);
							if(stage == 1 || stage == 6)
							{
								db[message.author.id].burgers += value;
							} else if(stage == 3 || stage == 7) {
								db[message.author.id].burgers -= value;
							}
							
							db[sender.id].reputation += repChange;
							
							if(db[message.author.id].burgers < 0) db[message.author.id].burgers = 0;
							if(db[message.author.id].reputation < 0) db[message.author.id].reputation = 0;
							if(db[message.author.id].reputation > 100) db[message.author.id].reputation = 100;
							updateDB(db);
						});
					}
				} else if(eventTracker[key] == 5) {
					var value = 0;
					if(eventStage[key] == 0)
					{
						randomEvents.call(ch, sender, 5, 0, value, repChange);
						eventStage[key] = 1;
					} else if(eventStage[key] == 1) {
						var stage;
						if(message.content.startsWith("1"))
						{
							stage = randomize(1, 3);
							if(stage == 1)
							{
								repChange = randomize(3, 10);
							} else if(stage == 2) {
								repChange = randomize(5, 12);	
							}
							randomEvents.call(ch, sender, 5, stage, value, repChange);	
						} else if(message.content.startsWith("2")) {
							stage = 3;
							randomEvents.call(ch, sender, 5, 3, value, repChange);	
						} else if(message.content.startsWith("3")) {
							value = randomize(5, 30);
							stage = randomize(4, 6);
							if(stage == 4)
							{
								repChange = randomize(-5, 1);
							} else if(stage == 5) {
								repChange = randomize(-15, -4);	
							}
							randomEvents.call(ch, sender, 5, stage, value, repChange);	
						} else {
							return;	
						}
						
						delete eventTracker[key];
						delete eventStage[key];
						
						if(stage == 3) return;
						
						request(getOptions, function(error, response, body) 
						{
							if(!body) return;
							db = JSON.parse(body);
							if(stage == 4 || stage == 5)
							{
								db[message.author.id].burgers -= value;
							}
							
							db[sender.id].reputation += repChange;
							
							if(db[message.author.id].burgers < 0) db[message.author.id].burgers = 0;
							if(db[message.author.id].reputation < 0) db[message.author.id].reputation = 0;
							if(db[message.author.id].reputation > 100) db[message.author.id].reputation = 100;
							updateDB(db);
						});
					}
				}
			}
		}
		
		//Race Event
		
		if(raceTracker[sender.id] == 1)
		{
			var ms_1 = "<:horsie:656477871476572203>";
			var ms_2 = "<:horsie:656477871476572203>";
			var ms_3 = "<:horsie:656477871476572203>";
			
			var ms_1C = 0;
			var ms_2C = 0;
			var ms_3C = 0;
			
			var amount = raceAmount[sender.id];
			var opt1 = raceOpt1[sender.id];
			var opt2 = raceOpt2[sender.id]; 
			var opt3 = raceOpt3[sender.id];
			
			var _opt1 = opt1.slice(0, 1);
			var _opt2 = opt2.slice(0, 1);
			var _opt3 = opt3.slice(0, 1);
			
			var pick;
			var pickName;
			var pickCode;
			
			if(message.content.startsWith("1"))
			{
				pick = 1;
				pickName = opt1;
			} else if(message.content.startsWith("2")) {
				pick = 2;
				pickName = opt2;
			} else if(message.content.startsWith("3")) {
				pick = 3;
				pickName = opt3;
			} else {
				return;	
			}
			pickCode = pickName.slice(0, 1);
			
			var x = ":wavy_dash: ";
			
			ch.send(":horse: __**A Day at the Races**__ :horse:\n**Stake: :hamburger: " + amount + " on " + pickName + "(" + pickCode + ").**\n**" + _opt1 + ")** :red_circle: " + ms_1 + "\n**" + _opt2 + ")** :yellow_circle: " + ms_2 + "\n**" + _opt3 + ")** :blue_circle: " + ms_3).then(function(msx)
			{
				for(i = 0; i < 30; i++)
				{
					var ms_1_ = randomize(0, 2);
					var ms_2_ = randomize(0, 2);
					var ms_3_ = randomize(0, 2);
						
					if(ms_1_ == 1) 
					{
						ms_1 = x + ms_1;
						ms_1C += 1;
					}
					if(ms_2_ == 1)
					{
						ms_2 = x + ms_2;
						ms_2C += 1;
					}
					if(ms_3_ == 1)
					{
						ms_3 = x + ms_3;
						ms_3C += 1;
					}
					
					msx.edit(":horse: __**A Day at the Races**__ :horse:\n**Stake: :hamburger: " + amount + " on " + pickName + "(" + pickCode + ").**\n**" + _opt1 + ")** :red_circle: " + ms_1 + "\n**" + _opt2 + ")** :yellow_circle: " + ms_2 + "\n**" + _opt3 + ")** :blue_circle: " + ms_3);
					if(ms_1_ == 10 || ms_2_ == 10 || ms_3_ == 10) break;
				}
				
				console.log(ms_1C + " " + ms_2C + " " + ms_3C);
				console.log("Pick: " + pick);
				var win = false;
				var timeout = 35; // in seconds
				timeout *= 1000;
				
				if(pick == 1)
				{
					console.log("One picked.");
					if(ms_1C > ms_2C && ms_1C > ms_3C)
					{
						var prize = amount * 3;
						win = true;
						setTimeout(function(){ post(":trophy: **Your horse " + opt1 + " has won the match! You won :hamburger: " + prize + "**"); }, timeout);
					} else if(ms_2C > ms_3C) {
						setTimeout(function(){ post(":disappointed: **Your horse " + opt1 + " has not been able to stand a chance against the might of " + opt2 + ".\nBetter luck next time!**"); }, timeout);
					} else {
						setTimeout(function(){ post(":disappointed: **Your horse " + opt1 + " has not been able to stand a chance against the might of " + opt3 + ".\nBetter luck next time!**"); }, timeout);
					}
				} else if(pick == 2) {
					if(ms_2C > ms_1C && ms_2C > ms_3C)
					{
						var prize = amount * 3;
						win = true;
						setTimeout(function(){ post(":trophy: **Your horse " + opt2 + " has won the match! You won :hamburger: " + prize + "**"); }, timeout);
					} else if(ms_1C > ms_3C){
						setTimeout(function(){ post(":disappointed: **Your horse " + opt2 + " has not been able to stand a chance against the might of " + opt1 + ".\nBetter luck next time!**"); }, timeout);
					} else {
						setTimeout(function(){ post(":disappointed: **Your horse " + opt2 + " has not been able to stand a chance against the might of " + opt3 + ".\nBetter luck next time!**"); }, timeout);
					}
				} else if(pick == 3) {
					if(ms_3C > ms_1C && ms_3C > ms_2C)
					{
						var prize = amount * 3;
						win = true;
						setTimeout(function(){ post(":trophy: **Your horse " + opt3 + " has won the match! You won :hamburger: " + prize + "**"); }, timeout);
					} else if(ms_1C > ms_2C){
						setTimeout(function(){ post(":disappointed: **Your horse " + opt3 + " has not been able to stand a chance against the might of " + opt1 + ".\nBetter luck next time!**"); }, timeout);
					} else {
						setTimeout(function(){ post(":disappointed: **Your horse " + opt3 + " has not been able to stand a chance against the might of " + opt2 + ".\nBetter luck next time!**"); }, timeout);
					}
				}
				
				if(amount == 0) return;
				request(getOptions, function(error, response, body) 
				{
					db = JSON.parse(body);
					if(win)
					{
						var prize = amount * 3;
						db[sender.id].burgers -= amount;
						db[sender.id].burgers += prize;
					} else {
						db[sender.id].burgers -= amount;
					}
					updateDB(db);
				});
			});
			
			delete raceTracker[sender.id];
			delete raceAmount[sender.id];
			delete raceOpt1[sender.id];
			delete raceOpt2[sender.id];
			delete raceOpt3[sender.id];
		}
	
		if(inFGame)
		{
			var response = message.content.toLowerCase(), flagName = flags[flagID].name.toLowerCase();
			
			if(response.includes(flagName))
			{
				var req = dbURL;
				var db;
				request(getOptions, function(error, response, body) 
				{
					if(!body) return;
					db = JSON.parse(body);
					var x = randomize(2, 10);
					//post(":trophy: ***" + message.author.username + "** has guessed correctly! Answer: **" + flags[flagID].name + "\nGiven :hamburger: " + x + " as prize.***");
					post(":trophy: ***" + message.author.username + "** has guessed correctly! Answer: **" + flags[flagID].name + "***");
					//db[message.author.id].burgers += x;
					db["gdp"].total += x;
					db["gdp"].flags += x;
					updateDB(db);
				});
				clearTimeout(flagTimeout);
				inFGame = false;
			}
		}
		
		if(message.guild != null && message.channel != null && message.content != null)
		{
			console.log("[" + message.guild.name + "]<#" + message.channel.name + ">" + message.author.username + ": " + message.content);
			if(message.guild.id != "616246848868450335" && sender.id != "652199012769988608")
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
		
		function onDefeat(player1, player2, winID, loseID)
		{
			var x = randomize(15, 31);
			var req = dbURL;
			inGame = false;
			p1isCrippled = false;
			p2isCrippled = false;
			post("***:trophy: " + player1 + " has defeated " + player2 + "!\nGiven :hamburger: " + x + " as a prize.***");
			request(getOptions, function(error, response, body) 
			{
				db = JSON.parse(body);
				if(!db[winID]) db[winID] = {burgers: 10};
				if(!db[winID]['battleData']) db[winID]['battleData'] = {wins: 0, matches:0};
				db[winID].burgers += x;
				
				db[winID].hp = temp[winID].hp;
				db[loseID].hp = temp[loseID].hp;
				
				db[winID]['battleData'].wins += 1;
				
				db[winID]['battleData'].matches += 1;
				db[loseID]['battleData'].matches += 1;
				
				if(db[winID].hp < 0) db[winID].hp = 0;
				if(db[loseID].hp < 0) db[loseID].hp = 0;
				
				db["gdp"].battle += x;
				db["gdp"].total += x;
				updateDB(db);
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
			
			request(getOptions, function(error, response, body) 
			{
				var db = JSON.parse(body);
				if (y == "h" || y == "heads")
				{
					if(x == 0)
					{
						post("*Guessed correctly! You got **heads***\n*Your prize:* :hamburger: **" + z + "**");
						db[sender.id].burgers += z;
						if(z == 0) return;
						console.log("Not 0!");
						updateDB(db);
					} else {
						post("Guessed incorrectly. You got **tails**!");
					}
					temp[sender.id].inGame = 0;
				} else if(y == "t" || y == "tails") {
					if(x == 1)
					{
						post("*Guessed correctly! You got **tails***\n*Your prize:* :hamburger: **" + z + "**");
						db[sender.id].burgers += z;
						if(z == 0) return;
						console.log("Not 0!");
						updateDB(db);
					} else {
						post("Guessed incorrectly. You got **heads**!");
					}
					temp[sender.id].inGame = 0;
				}
			});
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

		if(battleRequests[ch.id] && requestTo[sender.id])
		{
			console.log("AADV: " + requestTo[sender.id]);
			if(message.content.startsWith("1"))
			{
				console.log("AAPV");
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					if(db[sender.id].hp == 0)
					{
						post(":octagonal_sign: **You are too exhausted to battle!**\n**Refill your energy by buying an energy drink at the /store.**");	
						delete battleChannels[ch.id];
						delete playerOnes[battlePairsMirror[sender.id]];
						delete playerTwos[sender.id];
						delete battleRequests[ch.id];
						delete requestTo[sender.id];
						delete battlePairs[battlePairsMirror[sender.id]];
						delete battlePairsMirror[sender.id];
						delete battlePairNames[battlePairNamesMirror[sender.username]];
						delete battlePairNamesMirror[sender.username];
						
						return;
					}
				});
				
				delete battleRequests[ch.id];
				delete requestTo[sender.id];
				console.log("AAPX");
				
				if(battleChannels[ch.id] == 0) console.log("AAXY_1");
				if(battleChannels[ch.id] == 1) console.log("AAPL_1");
				
				console.log(playerTwos[sender.id]);
				
				if(battleChannels[ch.id] == 0 && temp[sender.id].hp > 0)
				{
					console.log("A");
					tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
				} else if(battleChannels[ch.id] == 1 && temp[sender.id].hp > 0) {
					console.log("B");
					return tabScreen(sender.username, battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
				}
			} else if (message.content.startsWith("2")) {
				delete battleChannels[ch.id];
				delete requestTo[sender.id];
				delete battleRequests[ch.id];
				delete playerOnes[battlePairsMirror[sender.id]];
				delete playerTwos[sender.id];
				delete battlePairs[battlePairsMirror[sender.id]];
				delete battlePairsMirror[sender.id];
				delete battlePairNames[battlePairNamesMirror[sender.username]];
				delete battlePairNamesMirror[sender.username];
				
				post(sender.username + " has fled the scene!");
			}
		}
	
		if((battleChannels[ch.id] == 0 && playerOnes[sender.id] || battleChannels[ch.id] == 1 && playerTwos[sender.id]) && !battleRequests[ch.id])
		{		
				console.log(battleChannels[ch.id]);
				if(message.content.startsWith("1") && temp[sender.id].hp > 0)
				{
					if(luckPoints > 85)
					{
						temp[sender.id].ammo += 1;
						post("***" + sender.username + " grabbed a magazine whilst punching their opponent! +1 ammo***");
					}
					var damage = randomize(5, 10);
					if(playerOnes[sender.id])
					{
						temp[battlePairs[sender.id]].hp -= damage;
						post(":punch: ***" + sender.username + " has punched " + battlePairNames[sender.username] + ". -" + damage + " HP***");
						
						if(temp[battlePairs[sender.id]].hp > 0)
						{
							battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
							tabScreen(battlePairNames[sender.username], sender.id, battlePairs[sender.id], sender.username, battlePairNames[sender.username]);
						} else {
							onDefeat(sender.username, battlePairNames[sender.username], sender.id, battlePairs[sender.id]);
							
							delete playerOnes[sender.id];
							delete playerTwos[battlePairs[sender.id]];
							
							delete isCrippled[sender.id];
							delete isCrippled[battlePairs[sender.id]];
							
							delete battlePairsMirror[battlePairs[sender.id]];
							delete battlePairs[sender.id];
							
							delete battlePairNamesMirror[battlePairNames[sender.username]];
							delete battlePairNames[sender.username];
							
							delete battleChannels[ch.id];
						}
					} else {
						temp[battlePairsMirror[sender.id]].hp -= damage;
						post(":punch: ***" + sender.username + " has punched " + battlePairNamesMirror[sender.username] + ". -" + damage + " HP***");
					
						if(temp[battlePairsMirror[sender.id]].hp > 0)
						{
							battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
							tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
						} else {
							onDefeat(sender.username, battlePairNamesMirror[sender.username], sender.id, battlePairsMirror[sender.id]);
								
							delete playerOnes[battlePairsMirror[sender.id]];
							delete playerTwos[sender.id];
								
							delete isCrippled[sender.id];
							delete isCrippled[battlePairsMirror[sender.id]];
							
							delete battlePairs[battlePairsMirror[sender.id]];
							delete battlePairsMirror[sender.id];
						
							delete battlePairNames[battlePairNamesMirror[sender.username]];
							delete battlePairNamesMirror[sender.username];
							
							delete battleChannels[ch.id];
						}
					}
				} else if(message.content.startsWith("2")) {
					if(playerOnes[sender.id] && isCrippled[sender.id])
					{
						post(":cartwheel: ***" + sender.username + " tried to kick their opponent but failed since they're crippled!***");
						
						battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
						tabScreen(battlePairNames[sender.username], sender.id, battlePairs[sender.id], sender.username, battlePairNames[sender.username]);
					} else if (sender.id == player2ID && p2isCrippled) {
						post(":cartwheel: ***" + sender.username + " tried to kick their opponent but failed since they're crippled!***");
						
						battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
						tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
					} else {
					if(luckPoints > 95)
					{
						if(playerOnes[sender.id])
						{
							isCrippled[sender.id] = 1;
							post(":boot: ***" + sender.username + " torn their hamstring whilst trying to kick their opponent!***");
							
							battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
							tabScreen(battlePairNames[sender.username], sender.id, battlePairs[sender.id], sender.username, battlePairNames[sender.username]);
						} else if(playerTwos[sender.id]) {
							isCrippled[sender.id] = 1;
							post(":boot: ***" + sender.username + " torn their hamstring whilst trying to kick their opponent!***");
							
							battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
							tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
						}
					} else {
						var damage = randomize(10, 20);
						if(playerOnes[sender.id])
						{
							temp[battlePairs[sender.id]].hp -= damage;
							post(":boot: ***" + sender.username + " has kicked " + battlePairNames[sender.username] + ". -" + damage + " HP***");

							if(temp[battlePairs[sender.id]].hp > 0)
							{
								battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
								tabScreen(battlePairNames[sender.username], sender.id, battlePairs[sender.id], sender.username, battlePairNames[sender.username]);
							} else {
								onDefeat(sender.username, battlePairNames[sender.username], sender.id, battlePairs[sender.id]);
							
								delete playerOnes[sender.id];
								delete playerTwos[battlePairs[sender.id]];
								
								delete isCrippled[sender.id];
								delete isCrippled[battlePairs[sender.id]];

								delete battlePairsMirror[battlePairs[sender.id]];
								delete battlePairs[sender.id];

								delete battlePairNamesMirror[battlePairNames[sender.username]];
								delete battlePairNames[sender.username];

								delete battleChannels[ch.id];
							}
						} else if(playerTwos[sender.id]) {
							temp[battlePairsMirror[sender.id]].hp -= damage;
							post(":boot: ***" + sender.username + " has kicked " + battlePairNamesMirror[sender.username] + ". -" + damage + " HP***");

							if(temp[battlePairsMirror[sender.id]].hp > 0)
							{
								battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
								tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
							} else {
								onDefeat(sender.username, battlePairNamesMirror[sender.username], sender.id, battlePairsMirror[sender.id]);
								
								delete playerOnes[battlePairsMirror[sender.id]];
								delete playerTwos[sender.id];
								
								delete isCrippled[sender.id];
								delete isCrippled[battlePairsMirror[sender.id]];
							
								delete battlePairs[battlePairsMirror[sender.id]];
								delete battlePairsMirror[sender.id];
							
								delete battlePairNames[battlePairNamesMirror[sender.username]];
								delete battlePairNamesMirror[sender.username];
							
								delete battleChannels[ch.id];
							}
						}
					}
					}
				} else if(message.content.startsWith("3")) {
					var damage = randomize(30, 70);

					if(playerOnes[sender.id])
					{
						if(temp[sender.id].ammo > 0)
						{
							var luck = randomize(0, 10);
							if(luck > 7)
							{
								post(":gun: ***Your shot has missed!***");
								temp[sender.id].ammo -= 1;	
								
								battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
								tabScreen(battlePairNames[sender.username], sender.id, battlePairs[sender.id], sender.username, battlePairNames[sender.username]);
							} else {
								temp[battlePairs[sender.id]].hp -= damage;
								temp[sender.id].ammo -= 1;
								post(":gun: ***" + sender.username + " has shot " + battlePairNames[sender.username] + ", dealing " + damage + " HP***");
								
								if(temp[battlePairs[sender.id]].hp > 0)
								{
									battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
									tabScreen(battlePairNames[sender.username], sender.id, battlePairs[sender.id], sender.username, battlePairNames[sender.username]);
								} else {
									onDefeat(sender.username, battlePairNames[sender.username], sender.id, battlePairs[sender.id]);
							
									delete playerOnes[sender.id];
									delete playerTwos[battlePairs[sender.id]];

									delete isCrippled[sender.id];
									delete isCrippled[battlePairs[sender.id]];

									delete battlePairsMirror[battlePairs[sender.id]];
									delete battlePairs[sender.id];

									delete battlePairNamesMirror[battlePairNames[sender.username]];
									delete battlePairNames[sender.username];

									delete battleChannels[ch.id];
								}
							}
						} else {
							post(":gun: **Click** ***You tried to open fire but you ran out of ammo!***");
							
							battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
							tabScreen(battlePairNames[sender.username], sender.id, battlePairs[sender.id], sender.username, battlePairNames[sender.username]);
						}
					} else if(playerTwos[sender.id]) {
						if(temp[sender.id].ammo > 0)
						{
							var luck = randomize(0, 10);
							if(luck > 7)
							{
								post(":gun: ***Your shot has missed!***");
								temp[sender.id].ammo -= 1;	
								
								battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
								tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
							} else {
								temp[battlePairsMirror[sender.id]].hp -= damage;
								temp[sender.id].ammo -= 1;
								post(":gun: ***" + sender.username + " has shot " + battlePairNamesMirror[sender.username] + ", dealing " + damage + " HP***");
								
								if(temp[battlePairsMirror[sender.id]].hp > 0)
								{
									battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
									tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
								} else {
									onDefeat(sender.username, battlePairNamesMirror[sender.username], sender.id, battlePairsMirror[sender.id]);
								
									delete playerOnes[battlePairsMirror[sender.id]];
									delete playerTwos[sender.id];

									delete isCrippled[sender.id];
									delete isCrippled[battlePairsMirror[sender.id]];

									delete battlePairs[battlePairsMirror[sender.id]];
									delete battlePairsMirror[sender.id];

									delete battlePairNames[battlePairNamesMirror[sender.username]];
									delete battlePairNamesMirror[sender.username];

									delete battleChannels[ch.id];
								}
							}
						} else {
							post(":gun: **Click** ***You tried to open fire but you ran out of ammo!***");
							
							battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
							tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
						}
					}
				} else if(message.content.startsWith("4")) {
					var healPoints = randomize(5, 30);
					var success = randomize(0, 100);

					if(temp[sender.id].hp + healPoints >= 100)
					{
						healPoints = 100 - temp[sender.id].hp;
					}
					
					if(playerOnes[sender.id])
					{
						if(success <= 70) 
						{
							temp[sender.id].hp += healPoints;
							post(":hamburger: ***" + sender.username + " has healed themselves, gaining " + healPoints + " HP***");
						
							battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
							tabScreen(battlePairNames[sender.username], sender.id, battlePairs[sender.id], sender.username, battlePairNames[sender.username]);
						} else {
							post(":dizzy_face: ***" + sender.username + " tried to heal themselves but failed!***");
							
							battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
							tabScreen(battlePairNames[sender.username], sender.id, battlePairs[sender.id], sender.username, battlePairNames[sender.username]);
						}
					} else if(playerTwos[sender.id]) {
						if(success <= 70)
						{
							temp[sender.id].hp += healPoints;
							post(":hamburger: ***" + sender.username + " has healed themselves, gaining " + healPoints + " HP***");
							
							battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
							tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
						} else {
							post(":dizzy_face: ***" + sender.username + " tried to heal themselves but failed!***");
							
							battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
							tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
						}
					}
				} else if(message.content.startsWith("5")) {
					var luck = randomize(0, 10);
					var damage = randomize(5, 10);
					if(luck > 4)
					{
						post(":footprints: ***" + sender.username + " has left the battlefield!***");
						if(playerOnes[sender.id])
						{
							onDefeat(battlePairNames[sender.username], sender.username, battlePairs[sender.id], sender.id);
							
							delete playerOnes[sender.id];
							delete playerTwos[battlePairs[sender.id]];

							delete isCrippled[sender.id];
							delete isCrippled[battlePairs[sender.id]];

							delete battlePairsMirror[battlePairs[sender.id]];
							delete battlePairs[sender.id];

							delete battlePairNamesMirror[battlePairNames[sender.username]];
							delete battlePairNames[sender.username];

							delete battleChannels[ch.id];
						} else if(playerTwos[sender.id]) {
							onDefeat(battlePairNamesMirror[sender.username], sender.username, battlePairsMirror[sender.id], sender.id);
								
							delete playerOnes[battlePairsMirror[sender.id]];
							delete playerTwos[sender.id];
							
							delete isCrippled[sender.id];
							delete isCrippled[battlePairsMirror[sender.id]];

							delete battlePairs[battlePairsMirror[sender.id]];
							delete battlePairsMirror[sender.id];

							delete battlePairNames[battlePairNamesMirror[sender.username]];
							delete battlePairNamesMirror[sender.username];

							delete battleChannels[ch.id];
						}
					} else {
						temp[sender.id].hp -= damage;
						post(":cartwheel: ***" + sender.username + " tried to run away but slipped and fell! -" + damage + " HP***");
						
						if(playerOnes[sender.id])
						{
							if(temp[sender.id].hp > 0)
							{
								battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
								tabScreen(battlePairNames[sender.username], sender.id, battlePairs[sender.id], sender.username, battlePairNames[sender.username]);
							} else {
								onDefeat(battlePairNames[sender.username], sender.username, battlePairs[sender.id], sender.id);
							
								delete playerOnes[sender.id];
								delete playerTwos[battlePairs[sender.id]];

								delete isCrippled[sender.id];
								delete isCrippled[battlePairs[sender.id]];

								delete battlePairsMirror[battlePairs[sender.id]];
								delete battlePairs[sender.id];

								delete battlePairNamesMirror[battlePairNames[sender.username]];
								delete battlePairNames[sender.username];

								delete battleChannels[ch.id];
							}
						} else  if(playerTwos[sender.id]) {
							if(temp[sender.id].hp > 0)
							{
								battleChannels[ch.id] = flipTurn(battleChannels[ch.id]);
								tabScreen(battlePairNamesMirror[sender.username], battlePairsMirror[sender.id], sender.id, battlePairNamesMirror[sender.username], sender.username);
							} else {
								onDefeat(battlePairNamesMirror[sender.username], sender.username, battlePairsMirror[sender.id], sender.id);
								
								delete playerOnes[battlePairsMirror[sender.id]];
								delete playerTwos[sender.id];

								delete isCrippled[sender.id];
								delete isCrippled[battlePairsMirror[sender.id]];

								delete battlePairs[battlePairsMirror[sender.id]];
								delete battlePairsMirror[sender.id];

								delete battlePairNames[battlePairNamesMirror[sender.username]];
								delete battlePairNamesMirror[sender.username];

								delete battleChannels[ch.id];
							}
						}
					}
				}
			setTimeout(function()
			{
				if(battleChannels[ch.id])
				{	
					post(":shrug: ***The battle has concluded with no clear victor.***");
					if(playerOnes[sender.id]) 
					{
						delete playerOnes[sender.id];
						delete playerTwos[battlePairs[sender.id]];

						delete isCrippled[sender.id];
						delete isCrippled[battlePairs[sender.id]];

						delete battlePairsMirror[battlePairs[sender.id]];
						delete battlePairs[sender.id];

						delete battlePairNamesMirror[battlePairNames[sender.username]];
						delete battlePairNames[sender.username];

						delete battleChannels[ch.id];
					} else if(playerTwos[sender.id]) {
						delete playerOnes[battlePairsMirror[sender.id]];
						delete playerTwos[sender.id];
							
						delete isCrippled[sender.id];
						delete isCrippled[battlePairsMirror[sender.id]];
					
						delete battlePairs[battlePairsMirror[sender.id]];
						delete battlePairsMirror[sender.id];
						
						delete battlePairNames[battlePairNamesMirror[sender.username]];
						delete battlePairNamesMirror[sender.username];

						delete battleChannels[ch.id];
					}
				}
			}, 1800000);
				
		}
	
		if(cmd0.charAt(0) == prefix)
		{
			cmd = cmd0.slice(1).toLowerCase();
		}
		
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
		
		if(cmd == "battle" || cmd == "baltop" || cmd == "bal" || cmd == "balance" || cmd == "balancetop" || cmd == "burger" || cmd == "coinflip" || cmd == "daily" || cmd == "pay" || cmd == "profile" || cmd == "rate" || cmd == "store" || cmd == "use") return;
		
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
						request(getOptions, function(error, response, body) 
						{
							var db = JSON.parse(body);
							console.log(db);
							if(db[sender.id].burgers - parseInt(args[1]) >= 0)
							{
								if(parseInt(args[1]) < 0) return post("You must enter a positive number.");
								
								if(!temp[sender.id]) temp[sender.id] = {inGame: 1, stake: args[1]};
								temp[sender.id] = {inGame: true, stake: args[1]};
								db[sender.id].burgers -= parseInt(args[1]);
								db["gdp"].coinflip += parseInt(args[1]);
								db["gdp"].total += parseInt(args[1]);
								updateDB(db);
								post(":money_with_wings: __***Coinflip***__ :money_with_wings:\n**Stake: :hamburger: " + args[1] + "**\n*Choose: heads/tails? (h/t)*");
							} else {
								post(":octagonal_sign: **You have insufficient burgers to do this bet.**");	
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
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					if(db[sender.id].burgers >= 1)
					{
						handler.burger(ch, message, burgerGifs);
						db[sender.id].burgers -= 1;
						db["gdp"].consumption += 1;
						db["gdp"].total += 1;
						updateDB(db);
					} else {
						post(":octagonal_sign: You do not have any burgers! :shrug:");	
					}
				});
				break;
			
			case "gdp_r":
				if(sender.id != "391239140068294659") return;
				if(args[1] != gdp_r_verif) return;
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					
					if(!db["gdp"]) db["gdp"] = {"total": 0, "flags": 0, "battle": 0, "coinflip": 0, "consumption": 0, "transactions": 0};
					
					db["gdp"].total = 0;
					db["gdp"].flags = 0;
					db["gdp"].battle = 0;
					db["gdp"].coinflip = 0;
					db["gdp"].consumption = 0;
					db["gdp"].transactions = 0;
					updateDB(db);
					post("Success.");
				});
				break;
				
			case "inf-apt":
				if(sender.id != "391239140068294659") return;
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					db[args[1]].burgers = parseInt(args[2]);
					updateDB(db);
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
			
			case "futures":
				var uri1;
				if(args[1] == "brent")
				{
					uri1 = "https://finviz.com/fut_chart.ashx?t=QA&p=h1&rev=637213994972398998";
					return ch.send("__**Brent Crude Oil Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				} else if(args[1] == "crude") {
					uri1 = "https://finviz.com/fut_chart.ashx?t=CL&cot=067651&p=h1&rev=637213994858796340";
					return ch.send("__**WTI Crude Oil Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				} else if(args[1] == "gas") {
					uri1 = "https://finviz.com/fut_chart.ashx?t=NG&cot=023651&p=h1&rev=637213995309769266";
					return ch.send("__**Natural Gas Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				} else if(args[1] == "copper") {
					uri1 = "https://finviz.com/fut_chart.ashx?t=HG&cot=085692&p=h1&rev=637213999000169571";
					return ch.send("__**Copper Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				} else if(args[1] == "gold") {
					uri1 = "https://finviz.com/fut_chart.ashx?t=GC&cot=088691&p=h1&rev=637213999920506084";
					return ch.send("__**Gold Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				} else if(args[1] == "platinum") {
					uri1 = "https://finviz.com/fut_chart.ashx?t=PL&cot=076651&p=h1&rev=637214000758039463";
					return ch.send("__**Platinum Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				} else if(args[1] == "silver") {
					uri1 = "https://finviz.com/fut_chart.ashx?t=SI&cot=084691&p=h1&rev=637214001013219357";
					return ch.send("__**Silver Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				} else if(args[1] == "dow") {
					uri1 = "https://finviz.com/fut_chart.ashx?t=YM&cot=124601,124603&p=h1&rev=637214007289891640";
					return ch.send("__**Dow Jones Industrial Average Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				} else if(args[1] == "nasdaq") {
					uri1 = "https://finviz.com/fut_chart.ashx?t=NQ&cot=209741,209742&p=h1&rev=637214008056258939";
					return ch.send("__**Nasdaq 100 Index Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				} else if(args[1] == "russell") {
					uri1 = "https://finviz.com/fut_chart.ashx?t=ER2&cot=239742&p=h1&rev=637214008373317543";
					return ch.send("__**Russell 2000 Index Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				} else if(args[1] == "sp500") {
					uri1 = "https://finviz.com/fut_chart.ashx?t=ES&cot=138741,13874A&p=h1&rev=637214009937927422";
					return ch.send("__**S&P 500 Index Futures**__", 
					{
					    files: [{
						    attachment: uri1,
						    name: 'chart.png'
					    }]
					});
				}
				
				var url = "https://cdn.discordapp.com/avatars/477763761629954060/f114c29fda258459d0518c80199f6630.png";
				var url_ = "https://pngimg.com/uploads/gold/gold_PNG11028.png";
				
				var botembed = new Discord.RichEmbed()
       				.setAuthor("Assets Futures", url)
				.setThumbnail(url_)
				.setDescription("__**Commands**__")
        			.addField("Energy", "**/futures brent** - Displays Brent crude oil futures chart.\n**/futures crude** - Displays WTI crude oil futures chart.\n**/futures gas** - Displays natural gas futures chart.")
        			.addField("Indices", "**/futures dow** - Displays Dow Jones Industrial Average futures chart.\n**/futures nasdaq** - Displays Nasdaq 100 futures chart.\n**/futures russell** - Displays Russell 2000 futures chart.\n**/futures sp500** - Displays S&P 500 futures chart.")
				.addField("Metals", "**/futures copper** - Displays copper futures chart.\n**/futures gold** - Displays gold futures chart.\n**/futures platinum** - Displays platinum futures chart.\n**/futures silver** - Displays silver futures chart.")
				.setColor("#fcc66a");
        
        			return ch.send(botembed);
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
					var uri1 = "https://stockcharts.com/c-sc/sc?s=%24INDU&p=D&b=5&g=0&i=0&r=1585158296615";
					var botembed1 = new Discord.RichEmbed()
					.setImage(uri1)
					.setColor("#fcc66a");
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
						var uri2 = "https://stockcharts.com/c-sc/sc?s=%24SPX&p=D&b=5&g=0&i=0&r=1585158609409";
						var botembed2 = new Discord.RichEmbed()
						.setImage(uri2)
						.setColor("#fcc66a");
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
								var uri3 = "https://stockcharts.com/c-sc/sc?s=%24COMPQ&p=D&b=5&g=0&i=0&r=1585158431338";
								var botembed3 = new Discord.RichEmbed()
								.setImage(uri3)
								.setColor("#fcc66a");
								post(out);
								ch.send(botembed1);
								ch.send(botembed2);
								ch.send(botembed3);
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

						var uri = "https://stockcharts.com/c-sc/sc?s=" + args[2] + "&p=D&b=5&g=0&i=0&r=1585150489758";
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

						request(getOptions, function(error, response, body) 
						{
							db = JSON.parse(body);
							if(db[sender.id] == null) db[sender.id] = {burgers: 10};
							if(isNaN(db[sender.id].burgers)) db[sender.id].burgers = 10;
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
								updateDB(db);
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
                                                date = date.slice(0, 10);

						var price = parseFloat(content['Time Series (Daily)'][date]['4. close']);
						price.toFixed(2);

						request(getOptions, function(error, response, body) 
						{
							db = JSON.parse(body);
							if(db[sender.id] == null) db[sender.id] = {burgers: 10};
							if(isNaN(db[sender.id].burgers)) db[sender.id].burgers = 10;
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

								updateDB(db);
								post("Successfully sold " + amount + " shares of **" + ticker + "** for **:hamburger: " + (amount * price) + "**.");
							}
						});
					});
					return;
				}
				
				if(args[1] == "portfolio" || args[1] == "pf")
				{
					request(getOptions, function(error, response, body) 
					{
						db = JSON.parse(body);
						if(db[sender.id] == null) db[sender.id] = {burgers: 10};
						if(isNaN(db[sender.id].burgers)) db[sender.id].burgers = 10;
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
					request(getOptions, function(error, response, body) 
					{
						db = JSON.parse(body);
						if(db[sender.id] == null) db[sender.id] = {burgers: 10};
						if(isNaN(db[sender.id].burgers)) db[sender.id].burgers = 10;
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
				var botembed = new Discord.RichEmbed()
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
				request(getOptions, function(error, response, body) 
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
			
			case "xxz":
				if(parseInt(args[1]) > 5) return;
				eventTracker[sender.id] = parseInt(args[1]);
				eventStage[sender.id] = 0;
				break;
				
			case "balance":
			case "bal":
			case "burgers":
				var db;
				var userFound;
				request(getOptions, function(error, response, body) 
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
						if(db[sender.id] == null) db[sender.id] = {burgers: 10};
						if(isNaN(db[sender.id].burgers)) db[sender.id].burgers = 10;
						post(`**:diamond_shape_with_a_dot_inside: ${sender.username}**'s *balance contains* :hamburger: **` + db[sender.id].burgers + `**`);
						updateDB(db);
					} else {
						if(userFound) return;
						var user = message.mentions.users.first();
						if(user.bot) return post(":octagonal_sign: **Semi-sentient beings are barred from Burgerbotz participation!**");
						if(db[user.id] == null) db[user.id] = {burgers: 10};
						if(isNaN(db[user.id].burgers)) db[user.id].burgers = 10;
						post(`**:diamond_shape_with_a_dot_inside: ${user.username}**'s *balance contains* :hamburger: **` + db[user.id].burgers + `**`);
						updateDB(db);
					}
				});
				break;
				
			case "pay":
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					var arg0 = args[2];
					if(message.mentions.users.size < 1)
					{
						for(var x in db)
						{
							if(args[1] == x)
							{
								if(parseFloat(arg0) < 0 || parseFloat(arg0) == 0) return post("You must enter a positive number.");
								
								if(db[sender.id].burgers - parseFloat(arg0) >= 0)
								{
									if(isNaN(db[x].burgers)) db[x].burgers = 10;
									db[x].burgers += parseFloat(arg0);							
									db[sender.id].burgers -= parseFloat(arg0);
									db["gdp"].transactions += parseFloat(arg0);
									db["gdp"].total += parseFloat(arg0);
									updateDB(db);
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
								db[user.id] = {burgers: 10};
							}
							
							if(parseFloat(arg0) < 0 || parseFloat(arg0) == 0) return post("You must enter a positive number.");
							
							if(db[sender.id].burgers - parseFloat(arg0) >= 0)
							{
								if(isNaN(db[user.id].burgers)) db[user.id].burgers = 10;
								db[user.id].burgers += parseFloat(arg0);							
								db[sender.id].burgers -= arg0;
								db["gdp"].transactions += parseFloat(arg0);
								db["gdp"].total += parseFloat(arg0);
								updateDB(db);
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
				var out = "**Server List**";
				client.guilds.forEach(function(guild)
				{
					x++;
					out += "**>" + guild.name + "** - " + guild.owner.user.username + "#" + guild.owner.user.discriminator + " - " + guild.memberCount + " members\n";
				});
				out += "Total: " + x + " servers";
				post(out);
				break;
				
			case "rate":
				var rating = parseFloat(args[2]);
				if(message.mentions.users.size < 1 || args[2] != rating || rating > 5 || (rating % 0.5) != 0 || rating < 0.5) return post("**:stars: Usage: /rate <user> <rating>**\n**Show how much you love (or absolutely despise) someone by giving them a rating!**\n**You can give someone a rating (represented by stars) from 0.5 to 5. Their average rating will be shown on their profile page.**");
				var toRate = message.mentions.users.first();
				//if(toRate.bot) return post("**:octagonal_sign: You can only rate users!**");
				if(toRate == sender) return post("**:octagonal_sign: You can not rate yourself!**");
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					db[toRate.id]['ratings'][sender.id] = rating;
					post("**" + sender.username + "#" + sender.discriminator + " has given " + toRate + " a rating of " + rating + " ( " + handler.getStars(rating) + ")**");
					updateDB(db);
				});
				break;
				
			case "queue":
				if(!musicServers[message.guild.id]) return post(":radio: **The queue is empty!**");
				if(musicServers[message.guild.id].queue && musicServers[message.guild.id].queue.length >= 1) 
				{
					var msg = ":radio: __**Queue**__";
					for(i = 0; i < musicServers[message.guild.id].queue.length; i++)
					{
						msg += "\n" + (i + 1) + ") **" + musicServers[message.guild.id].titles[i] + "**";
					}
					post(msg);
				} else {
					post(":radio: **The queue is empty!**");	
				}
				break;
				
			case "ytx":
				function addServer(message)
				{
					musicServers[message.guild.id] =
					{
						queue: [],
						titles: [],
						thumbnails: []
					};	
				}
				
				function play(connection, message)
				{
					var server = musicServers[message.guild.id];
					server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
					server.queue.shift();
					server.titles.shift();
					server.thumbnails.shift();
					
					server.dispatcher.on("end", function()
					{
						if(server.queue[0])
						{
							play(connection, message);
						} else {
							connection.disconnect();
						}
					});
				}
				
				function addToQueue(message, url, title, thumbnail)
				{
					musicServers[message.guild.id].queue.push(url);	
					musicServers[message.guild.id].titles.push(title);
					musicServers[message.guild.id].thumbnails.push(thumbnail);
				}
				
				args.shift();
				var query = args.join(" ");
				var url = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAhx-tA7JcIMYEqWcx1hiNVAB9f3_xok8g&part=id,snippet&type=video&maxResults=1&q=" + query;
				request(url, function(error, response, body) 
				{
					var db = JSON.parse(body);
					var id = db['items'][0]['id']['videoId'];
					var title = db['items'][0]['snippet']['title'];
					var thumbnail = db['items'][0]['snippet']['thumbnails']['default']['url'];
					if(!musicServers[message.guild.id]) 
					{
						addServer(message);
						post(":notes: Playing **" + title + "**.");
					} else {
						post(":notes: Added to queue: **" + title + "**.");	
					}
					addToQueue(message, "https://www.youtube.com/watch?v=" + id, title, thumbnail);
				});
				
				if(!message.guild.voiceConnection) message.member.voiceChannel.join()
					.then(function(connection)
					{
						play(connection, message);
					});
				break;
				
			case "skip":
				var server = musicServers[message.guild.id];
				if(server.dispatcher) server.dispatcher.end();
				post(":next_track: *Skipped.*");
				break;
				
			case "stop":
				var server = musicServers[message.guild.id];
				if(message.guild.voiceConnection)
				{
					for(i = server.queue.length - 1; i >= 0; i--)
					{
						server.queue.splice(i, 1);	
					}
					server.dispatcher.end();
					post(":stop_button: *Stopped.**");
				}
				
				if(message.guild.connection) message.guild.voiceConnection.disconnect();
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
				request(getOptions, function(error, response, body) 
				{
					db = JSON.parse(body);
					db["gdp"] += parseFloat(args[1]);
					updateDB(db);
					console.log("A");
				});
				break;
			
			case "profile":
				var targetUser;
				if(message.mentions.users.size < 1)
				{
					targetUser = sender;	
				} else {
					targetUser = user;	
				}
				
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					var rating = 0;
					var ratingStars = 0;
					var stars;
					var raters = 0;
					
					var winRate = (db[targetUser.id]['battleData'].wins / db[targetUser.id]['battleData'].matches) * 100;
					if(!winRate) winRate = 0;
					
					if(!db[targetUser.id].reputation && db[targetUser.id].reputation != 0) 
					{
						db[targetUser.id].reputation = 50;
						updateDB(db);
					}
					if(!db[targetUser.id]['ratings'])
					{
						stars = handler.getStars(rating);
					} else {
						for(var key in db[targetUser.id]['ratings'])
						{
							rating += db[targetUser.id]['ratings'][key];
							raters += 1;
							console.log(key + " " + db[targetUser.id]['ratings'][key]);
						}
						rating /= raters;
						ratingStars = Math.round(rating * 2) / 2;
						stars = handler.getStars(ratingStars);
						rating = rating.toFixed(2);
					}
					
					var repBar = handler.getReputationBar(db[targetUser.id].reputation);
					
					if(targetUser.bot)
					{
						var botembed = new Discord.RichEmbed()
							.setThumbnail(targetUser.avatarURL)
							.setTitle(targetUser.username)
							.setColor("#fcc66a")
							.setDescription("A human's servant.")
							.addField("Bot Rating", stars + " " + rating + " (" + raters + ")");
						return ch.send(botembed);
					}
					
					var botembed = new Discord.RichEmbed()
							.setThumbnail(targetUser.avatarURL)
							.setTitle(targetUser.username)
							.setColor("#fcc66a")
							.setDescription(handler.getUserDescription(targetUser.username, db[targetUser.id].burgers, db[targetUser.id].reputation))
							.addField("Health", ":heart: " + db[targetUser.id].hp)
							.addField("Wealth", ":hamburger: " + db[targetUser.id].burgers)
							.addField("Reputation", repBar)
							.addField("Battle Statistics", ":fist: **" + db[targetUser.id]['battleData'].wins + "** wins / **" + db[targetUser.id]['battleData'].matches + "** matches\n:trophy: **Win Rate: " + winRate + "%**")
							.addField("User Rating", stars + " " + rating + " (" + raters + ")");
							ch.send(botembed);
				});
				break;
				
			case "horserace":
				if(raceTracker[sender.id] == 1)
				{
					return post(":octagonal_sign: **You are already betting on a race!**");	
				}
				if(args[1] != parseInt(args[1]))
				{
					return post(":horse: **Usage: /horserace <bet amount>**");	
				}
                                if(parseInt(args[1]) < 0) return post (":octagonal_sign: **You have to enter a positive number!**");
				
				raceTracker[sender.id] = 1;
				raceAmount[sender.id] = parseInt(args[1]);

				raceOpt1[sender.id] = unst.horseNames[randomize(0, unst.horseNames.length)];
				raceOpt2[sender.id] = unst.horseNames[randomize(0, unst.horseNames.length)];
				raceOpt3[sender.id] = unst.horseNames[randomize(0, unst.horseNames.length)];
				if(raceOpt1[sender.id] == raceOpt2[sender.id] || raceOpt1[sender.id] == raceOpt3[sender.id]) raceOpt1[sender.id] = unst.horseNames[randomize(0, unst.horseNames.length)];
				if(raceOpt2[sender.id] == raceOpt3[sender.id]) raceOpt2[sender.id] = unst.horseNames[randomize(0, unst.horseNames.length)];
				
				var msx = ":horse: __**A Day at the Races**__ :horse:\n**Stake: :hamburger: " + raceAmount[sender.id] + "**\n**Pick your horse:**\n**:red_circle: [1] " + raceOpt1[sender.id] + "**\n**:yellow_circle: [2] " + raceOpt2[sender.id] + "**\n**:blue_circle: [3] " + raceOpt3[sender.id] + "**";
				
				post(msx);
				break;
				
			case "use":
				if(args[1] == "energy")
				{
					request(getOptions, function(error, response, body) 
					{	
						var db = JSON.parse(body);
						if(!db[sender.id]['inventory']) db[sender.id]['inventory'] = {energyDrinks: 0};
						if(db[sender.id]['inventory'].energyDrinks > 0)
						{
							if(playerOnes[sender.id] || playerTwos[sender.id])
							{
								return post(":octagonal_sign: **You may not use this item while in battle.**");	
							}
							var recovery = randomize(70, 101);
							db[sender.id]['inventory'].energyDrinks -= 1;
							db[sender.id].hp += recovery;
							if(db[sender.id].hp > 100) db[sender.id].hp = 100;
							post("<:drink:660031984092839947> **You drank an energy drink. +:heart: " + recovery + " HP.**");
							updateDB(db);
						} else {
							post("**:octagonal_sign: You don't have any energy drinks! Type */store* to acquire one.**");	
						}
					});
					return;
				}
				post("**Usage: /consume <item>**\n*Type /inventory to see your owned consumables.*");
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
			
			case "inf-r":
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					for(var key in db)
					{
						db[key].burgers = db[key].burgers * 10;
						console.log("Reevaluated " + key + "'s balance.");
					}
					updateDB(db);
				});
				break;
			
			case "i":
			case "inv":
			case "inventory":
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					if(!db[sender.id]['inventory'] || !db[sender.id]['inventory'].energyDrinks) 
					{
						db[sender.id]['inventory'] = {energyDrinks: 0};
						updateDB(db);
					}
					post(handler.getInventory(sender.username, db[sender.id]['inventory'].energyDrinks));
				});
				break;
				
			case "economy":
				request(getOptions, function(error, response, body) 
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
			
			case "inf-rs":
				if(sender.id != "391239140068294659") return;
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					for(var key in db)
					{
						client.users.forEach(function (us)
						{
							if(key == us.id) return console.log(us.id + " exists.");	
						});
						console.log(key + "Doesn't exist, deleting.");
						delete db[key];
					}
					updateDB(db);
				});
				break;
				
			case "aadx":
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					var dBase = JSON.stringify(db);

					//for(var key in db)
					//{
					//	client.users.forEach(function (us)
					//	{
					//		if(key == us.id) return console.log(us.id + " exists.");	
					//	});
					//	console.log(key + "Doesn't exist, deleting.");
					//	delete db[key];
					//}
					
					client.users.forEach(function(u)
					{
						if(!db[u.id]) db[u.id] = {burgers: 10};
						if(!db[u.id].hp)
						{
							db[u.id].hp = 100;
							console.log("Added DB HP data for user " + u.username);
						}
						if(!db[u.id]['ratings']) 
						{
							db[u.id]['ratings'] = {};
							console.log("Added ratings DB for user " + u.username);
						}
						if(!db[u.id]['battleData'])
						{
							db[u.id]['battleData'] = {wins: 0, matches: 0};
							console.log("Added battle DB for user " + u.username);
						}
						
					});
					
					updateDB(dBase);
				});
				break;
				
			case "aadz":
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					client.users.forEach(function(u)
					{
						if(!db[u.id])
						{
							db[u.id] = {burgers: 10};
							console.log("Added DB for user " + u.username);
						}
					});
					updateDB(db);
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
			
			case "store":
				if(args[1] == "buy")
				{
					var selection = args[2];
					var amount;
					var value;
					
					if(args[3] == "drink" && args[2] == "energy")
					{
						amount = parseInt(args[4]);
					} else {
						amount = parseInt(args[3]);	
					}
					
					if((parseInt(args[3]) == args[3] && parseInt(args[3]) > 0) || (parseInt(args[4]) == args[4] && parseInt(args[4]) > 0))
					{
						if(selection == "energy")
						{
							request(getOptions, function(error, response, body) 
							{
								var db = JSON.parse(body);
								value = amount * 5;
								
								if(db[sender.id].burgers >= value)
								{
									if(!db[sender.id]['inventory']) db[sender.id]['inventory'] = {energyDrinks: 0};
									db[sender.id]['inventory'].energyDrinks += amount;
									db[sender.id].burgers -= value;
									post("**Successfully bought " + amount + " <:drink:660031984092839947> for :hamburger: " + value + ".**");
									updateDB(db);
								} else {
									return post(":octagonal_sign: **You have insufficient burgers to buy <:drink:660031984092839947> " + amount + ".**");
								}
							});
							return;
						}
					}
				}
				var storeEmbed = new Discord.RichEmbed()
						.setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f6d2.png")
						.setColor("#fcc66a")
						.setTitle("The Burgerstore")
						.setDescription("The official Burgerbotz item store!\nUsage: /store buy <item> <amount>\nTo use an item, type /use <item>")
						.addField("Consumables", "<:drink:660031984092839947> **Energy Drink** - Refills your energy. - :hamburger: **5**");
						ch.send(storeEmbed);
				break;

			case "daily":
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					var date = new Date();
					var dailyDate = new Date(db[sender.id].dailyDate);
					if(!db[sender.id].dailyDate || date.getTime() > dailyDate.getTime())
					{
						var output = randomize(10, 15);
						date.setDate(date.getDate() + 1);
						db[sender.id].burgers += output;
						post(":calendar: **You have claimed your daily dose of burgers worth :hamburger: " + output + "!**");
						db[sender.id].dailyDate = date;
						updateDB(db);
					} else {
						console.log(date + " " + dailyDate);
						var timeRemaining = new Date(dailyDate - date);
						post(":calendar: **You have claimed your daily dose of burgers today. It will be available again in " + timeRemaining.getHours() + "h " + timeRemaining.getMinutes() + "m " + timeRemaining.getSeconds() + "s.**");
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
				
			case "aadp":
				request(getOptions, function(error, response, body) 
				{
					var db = JSON.parse(body);
					client.users.forEach(function(u)
					{
						if(!db[u.id]['ratings']) db[u.id]['ratings'] = {};
						console.log("Added ratings DB for user " + u.username);
					});
					updateDB(db);
				});
				break;
				
			case "aadv":
				var db;
				if(sender.id != "391239140068294659" || args.length < 0 || parseInt(args[1]) != args[1]) return;
				var increment = parseInt(args[1]);
				
				request(getOptions, function(error, response, body) 
				{
					console.log('error:', error);
					console.log('statusCode:', response && response.statusCode);
					
					db = JSON.parse(body);
					db[sender.id].burgers += increment;
					post(db[sender.id].burgers);
					updateDB(db);
				});
				//request({
  				//	method: "PUT",
  				//	uri: req,
  				//	json: body
 				//});
				break;
				
			case "battle":
				//if(sender.id != "391239140068294659" && sender.id != "412211364682137600" && sender.id != "600339048665710605") return post(":octagonal_sign: **Burgerbotz battle game is currently under maintenance.**\n**Sorry for the inconvenience.**");
				if(message.mentions.users.size < 1) 
				{
					post(":octagonal_sign: **You have to mention someone to battle with.**")
				} else if(message.mentions.users.size >= 1 && user === sender) {
					post(":octagonal_sign: **You can not battle yourself!**");
				} else if(battleChannels[ch.id]) {
					post(":octagonal_sign: **A battle is already ongoing in this channel!**");
				} else if(playerOnes[sender.id] || playerTwos[sender.id]) {
					post(":octagonal_sign: **You can only be involved in one battle at a time!**");	
				} else if(playerOnes[user.id] || playerTwos[user.id]) {
					post(":octagonal_sign: **" + user.username + " is already in a battle!**");
				} else {
					request(getOptions, function(error, response, body) 
					{
						var db = JSON.parse(body);
						var xHP = db[user.id].hp;
						var yHP = db[sender.id].hp;
						
						if(!temp[user.id]) temp[user.id] = {hp: xHP, ammo: 1};
						if(!temp[sender.id]) temp[sender.id] = {hp: yHP, ammo: 1};
					
						temp[user.id] = {hp: xHP, ammo: 1};
						temp[sender.id] = {hp: yHP, ammo: 1};
						
						if(temp[sender.id].hp <= 0 || !temp[sender.id].hp)
						{
							return post(":octagonal_sign: **You are too exhausted to battle!**\n**Refill your energy by buying an energy drink at the /store.**");
						}
						var rand = randomize(0, 2);
						if(rand > 0)
						{
							battleChannels[ch.id] = 0;
						} else {
							battleChannels[ch.id] = 1;
						}
						requestTo[user.id] = 1;

						post(`${user}, you have been challenged to a battle by ${sender.username}!` + "\n```[1] Engage\n[2] Run```");
						battleRequests[ch.id] = 1;

						battlePairs[sender.id] = user.id;
						battlePairsMirror[user.id] = sender.id;
						battlePairNames[sender.username] = user.username;
						battlePairNamesMirror[user.username] = sender.username;
						playerOnes[sender.id] = 1;
						playerTwos[user.id] = 1;
					});

					setTimeout(function()
				        {
						if(battleRequests[ch.id])
						{	
							post(":shrug: ***" + user.username + " has ignored " + sender.username + "'s challenge to battle.***");
							delete battleChannels[ch.id];
							delete playerOnes[sender.id];
							delete playerTwos[battlePairs[sender.id]];
							delete battleRequests[ch.id];
							delete requestTo[battlePairs[sender.id]];
							delete battlePairsMirror[battlePairs[sender.id]];
							delete battlePairs[sender.id];
							delete battlePairNamesMirror[battlePairNames[sender.username]];
							delete battlePairNames[sender.username];
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


function updateDB(db)
{
	var options = {
		url: dbURL,
		headers: {
			'secret-key': dbKey,
			'versioning': false
		},
		method: 'PUT',
		json: db
	};

	request(options, function (error, response, body) {});
}

client.login(process.env.BOT_TOKEN);
