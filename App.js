const Discord = require(`discord.js`);
const fs = require(`fs`);
const mongoose = require(`mongoose`);

const client = new Discord.Client();

//Collections
client.commands = new Discord.Collection();

client.afk = new Discord.Collection();
client.coinChoice = new Discord.Collection();

client.phoneChannels = new Discord.Collection();
client.flagChannels = new Discord.Collection();
client.capitalChannels = new Discord.Collection();

client.horseChoice = new Discord.Collection();
client.horseChoices = new Discord.Collection();

client.battleState = new Discord.Collection();   //Battle state
client.battlePairs = new Discord.Collection();   //Player pairing
client.battleEffects = new Discord.Collection(); //Player Effects: 0 - No effect, 1 - Foot crippled
client.battleHealth = new Discord.Collection();  //Player HP
client.battleBullets = new Discord.Collection(); //Number of bullets

//Keys
client.stockApiKey = process.env.STOCK_KEY;
client.newsApiKey = process.env.NEWS_KEY;

//Bot Server
client.inviteObj = {"x": 0};
client.botServer;
client.joinChannel;
client.leaveChannel;
client.logChannel;

//Utilities and functions
const utils = require(`./Utils.js`);

//Handler
const handler = require(`./handlers/EventHandler.js`);

const mongoURI = process.env.MONGO_URI;
const prefix = `/`;

mongoose.connect(mongoURI, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.on(`ready`, () =>
{
    console.log(`Burgerbotz Ready!`);

    client.user.setPresence(
    { 
        activity: 
        { 
            name: `/help`,
            type: `STREAMING`
        }
    });

    fs.readdirSync(`./commands`).forEach((file) =>
    {
        let commandFile = require(`./commands/${file}`);
        client.commands.set(file.toString().toLowerCase().replace(`.js`, ``), commandFile);
    });

    handler.init(client);

    client.botServer.fetchInvites().then(invite =>
    {
        let inviteArray = invite.array();
        for(let i = 0; i < inviteArray.length; i++)
        {
            let inv = inviteArray[i];
            client.inviteObj[inv.code] = inv.uses;        
        }
    });
});

client.on(`guildMemberAdd`, (member) =>
{
    if(member.guild.id == client.botServer.id) return handler.memberAddBotServer(client, member);
});

client.on(`guildMemberRemove`, (member) =>
{
    if(member.guild.id == client.botServer.id) return handler.memberRemoveBotServer(client, member);
});

client.on(`message`, (message) =>
{
    let ch = message.channel;
    let sender = message.author;
    let msg = message.content.toLowerCase();

    if(sender.bot) return;

    const args = msg.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    handler.run(client, message, args, command);

    if(!msg.startsWith(prefix)) return;

    try { client.commands.get(command).run(client, message, args); } catch(err) 
    {
        for(var key of client.commands.keys())
        {
            if(client.commands.get(key).headers.aliases.includes(command)) return client.commands.get(key).run(client, message, args);
        }
    }
});

client.login(process.env.BOT_TOKEN);
