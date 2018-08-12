const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

var database = JSON.parse(fs.readFileSync('userData.json', 'utf8'));

client.on('ready', () => 
{
    console.log('Burgerbotz ready! :3');
});

function randomize(min, max) 
{
	return Math.floor(Math.random() * (max - min)) + min;
}

const prefix = "/";
const helpTab = "```/coinflip - Flips a coin\n/dm - Sends DM to a user\n/help - Shows this help screen\n/ping - Pong\n/post - Posts a message\n/random - Generates a random number\n/rape - Rapes a user\n/s - Spits on grave```";

//a

var inGame = false;
var inRequest = false;
var turnID = "";
var reqID = "";
var player1ID = "";
var player2ID = "";
var player1Name = "";
var player2Name = "";

client.on('message', message => 
{
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
			post("***:trophy: " + player1 + " has defeated " + player2 + "!***");
		}
		
		let sender = message.author;
	
		if(sender === client.user) return;
		
		let user = message.mentions.users.first();
		let target = message.guild;
		
		if(inRequest && reqID === sender.id)
		{
			if(message.content.startsWith("1"))
			{
				inGame = true;
				inRequest = false;
				if(turnID == player1ID)
				{
					tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
				} else {
					tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
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
					var damage = randomize(5, 10);
					if(sender.id === player1ID)
					{
						database[player2ID].hp -= damage;
						post(player1Name + " has punched " + player2Name + ". -" + damage + " HP");
						
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
						post(player2Name + " has punched " + player1Name + ". -" + damage + " HP");
						
						if(database[player1ID].hp > 0)
						{
							turnID = player1ID;
							tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							onDefeat(player2Name, player1Name);
							inGame = false;
						}
					}
				} else if(message.content.startsWith("2")) {
					var damage = randomize(10, 20);
					if(sender.id === player1ID)
					{
						database[player2ID].hp -= damage;
						post(player1Name + " has kicked " + player2Name + ". -" + damage + " HP");
						
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
						post(player2Name + " has kicked " + player1Name + ". -" + damage + " HP");
						
						if(database[player1ID].hp > 0)
						{
							turnID = player1ID;
							tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
						} else {
							onDefeat(player2Name, player1Name);
							inGame = false;
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
								post("Your shot has missed!");
								database[player1ID].ammo -= 1;	
								
								turnID = player2ID;
								tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
							} else {
								database[player2ID].hp -= damage;
								database[player1ID].ammo -= 1;
								post(player1Name + " has shot " + player2Name + ", dealing " + damage + " HP");
								
								turnID = player2ID;
								tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);	
							}
						} else {
							post("**Click** You tried to open fire but you ran out of ammo!");
							
							turnID = player2ID;
							tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
						}
					} else {
						if(database[player2ID].ammo > 0)
						{
							var luck = randomize(0, 10);
							if(luck > 7)
							{
								post("Your shot has missed!");
								database[player2ID].ammo -= 1;	
								
								turnID = player1ID;
								tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
							} else {
								database[player1ID].hp -= damage;
								database[player2ID].ammo -= 1;
								post(player2Name + " has shot " + player1Name + ", dealing " + damage + " HP");
								
								turnID = player1ID;
								tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);	
							}
						} else {
							post("**Click** You tried to open fire but you ran out of ammo!");
							
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
						post(player1Name + " has healed themselves, gaining " + healPoints + " HP");
						
						turnID = player2ID;
						tabScreen(player2Name, player1ID, player2ID, player1Name, player2Name);
					} else {
						database[player2ID].hp += healPoints;
						post(player2Name + " has healed themselves, gaining " + healPoints + " HP");
						
						turnID = player1ID;
						tabScreen(player1Name, player1ID, player2ID, player1Name, player2Name);
					}
				} else if(message.content.startsWith("5")) {
					var luck = randomize(0, 10);
					var damage = randomize(5, 10);
					if(luck > 6)
					{
						post(sender.username + " has left the battlefield!");
						inGame = false;
					} else {
						database[sender.id].hp -= damage;
						post(sender.username + " tried to run away but slipped and fell! -" + damage + " HP");
						
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
				
		}
	
		var msg0 = message.content.split(' ');
		delete msg0[0];
		var arg = msg0.join(" ");
		
		var msg = message.content.toLowerCase();
		const args = msg.slice(prefix.length).trim().split(/ +/g);
		
		const command = args.shift().toLowerCase();
		
		switch(command)
		{
			case "help":
				post("***__Burgerbotz Commands__***\n" + helpTab);
				break;
			
			case "s":
				var x = randomize(0, 5);
				if(x > 1)
				{
					post(`${message.author}` + " has spitted on" + arg + "'s grave :purple_heart:");
				} else {
					post(`${message.author}` + " has took a shit on" + arg + "'s grave :poo:");
				}	
				break;
				
			case "ping":
				post("***PONG!*** Returned request in " + (Date.now() - message.createdTimestamp) + " ms");
				break;
					
			case "random":
				if(args[0] == null)
				{
					post("Correct usage: /random <upper bound>");
				} else {
					var x = parseInt(args[0]);
					post("Returned integer " + Math.floor(Math.random() * x));
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
					message.channel.send(`${user} has been brutally sodomized by ${message.author}`, {files: ["https://img.4plebs.org/boards/sp/image/1405/27/1405279865972.gif"]});
				}
				break;
					
			case "dm":
				if(message.mentions.users.size < 1)
				{
					message.reply("please specify a user to message.");
				} else {
					delete msg0[1];
					var msg1 = msg0.join(" ");
					user.send(msg1);
				}
				break;
			
			case "post":
				post(arg);
				break;
				
			case "battle":
				if(message.mentions.users.size < 1) 
				{
					post("You have to mention someone to battle with")
				} else if (message.mentions.users.size >= 1 && user === sender) {
					post("You can not battle yourself!");
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
				}
				break;

	}
		fs.writeFile('userData.json', JSON.stringify(database), (err) =>
		{
			if(err) throw err;		
		});
});

client.login(process.env.BOT_TOKEN);
