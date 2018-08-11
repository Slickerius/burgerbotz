const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Burgerbotz ready! :3');
});

function randomize(min, max) 
{
	return Math.floor(Math.random() * (max - min)) + min;
}


const prefix = "/";
const helpTab = "```/coinflip - Flips a coin\n/dm - Sends DM to a user\n/help - Shows this help screen\n/ping - Pong\n/post - Posts a message\n/random - Generates a random number\n/rape - Rapes a user\n/s - Spits on grave```";

client.on('message', message => 
{
    function post(String)
		{
			message.channel.send(String);
			return 0;
		}
		
		if(message.author === client.user) return;
		
		let user = message.mentions.users.first();
		let target = message.guild;
		
		var msg0 = message.split(' ');
		
		var msg = message.content.toLowerCase();
		const args = msg.slice(prefix.length).trim().split(/ +/g);

		if(message.content.startsWith("+s"))
		{
			args[0] = "";
			var x = randomize(0, 5);
			if(x > 1)
			{
				post(`${message.author}` + " has spitted on" + args.join(" ") + "'s grave :purple_heart:");
			} else {
				post(`${message.author}` + " has took a shit on" + args.join(" ") + "'s grave :poo:");
			}
		}
		
		const command = args.shift().toLowerCase();
		
		switch(command)
		{
			case "help":
				post("***__Burgerbotz Commands__***\n" + helpTab);
				break;
			
			case "s":
				args[0] = "";
				var x = randomize(0, 5);
				if(x > 1)
				{
					post(`${message.author}` + " has spitted on" + args.join(" ") + "'s grave :purple_heart:");
				} else {
					post(`${message.author}` + " has took a shit on" + args.join(" ") + "'s grave :poo:");
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
			{
				if(message.mentions.users.size < 1)
				{
					message.reply("please specify a user to message.");
				} else {
					delete args[0];
					user.send(args.join(" "));
				}
				break;
			}
			
			case "post":
				delete msg0[0];
				var msg1 = msg0.join(" ");
				post(msg1);
				break;

	}
});

client.login(process.env.BOT_TOKEN);
