const UserProfile = require(`../models/UserProfile.js`);

const phone = require(`./PhoneHandler.js`);
const coinflip = require(`./CoinflipHandler.js`);
const afk = require(`./AFKHandler.js`);
const horserace = require(`./HorseraceHandler.js`);
const flags = require(`./FlagHandler.js`);
const capitals = require(`./CapitalHandler.js`);

const battle = require(`./battle/BattleHandler.js`);

const botServer = require(`./BotServerHandler.js`);

exports.init = (client) =>
{
    client.guilds.cache.forEach((guild) =>
    {
        if(guild.id == `613500872839921675`) client.botServer = guild;
    });

    client.channels.cache.forEach((channel) =>
    {
        if(channel.id == `620578833225220106`) client.joinChannel = channel;
        if(channel.id == `620578888610873355`) client.leaveChannel = channel;
        if(channel.id == `656845623345020988`) client.logChannel = channel;
        if(channel.id == `616246849367441428`) client.intelChannel = channel;
    });
}

exports.run = (client, message, args, command) =>
{
    let { content, author, channel } = message;

    if(channel.type == `text` && message.guild.id != `616246848868450335`) 
    {
        client.intelChannel.send(`[${message.guild.name}]<#${channel.name}>**${author.username}#${author.discriminator}** : ${message.content}`);
        message.attachments.forEach((attachment) =>
        {
            client.intelChannel.send(
            {
                files: attachment.url
            });
        });
    }

    if(client.phoneChannels.get(channel) && command != `bp` && command != `burgerphone`) phone.echo(client, message);
    
    if(client.coinChoice.get(author) == ` `) coinflip.run(client, message);

    if(client.horseChoices.get(author))
    {
        console.log(`A `);
        horserace.run(client, message);
    }
    
    if(client.flagChannels.get(channel)) flags.run(client, message);

    if(client.capitalChannels.get(channel)) capitals.run(client, message);

    if(client.afk.get(author) && command != `afk`) afk.cancel(client, message);

    if(message.mentions.users.size >= 1)
    {
        message.mentions.users.forEach((user) =>
        {
            if(client.afk.get(user)) 
            {
                afk.notify(client, message, user);
            }
        });
    }

    if(client.battleState.get(author) == 2) battle.turn(client, message);
    if(client.battleState.get(author) == 0) battle.run(client, message);

    //Bot Server
    if(message.channel.type == `text` && message.guild.id == client.botServer.id)
    {
        botServer.handleInvite(client, message);
    }

    //Database

    UserProfile.findOne(
    {
        id: author.id
    }, (err, profile) =>
    {
        if(!profile)
        {
            const newProfile = new UserProfile(
            {
                id: author.id,
                burgers: 10
            });
            console.log(`Created new DB data for user ${author.username}#${author.discriminator}`);
            newProfile.save();
        }
    });
}

exports.memberAddBotServer = (client, member) =>
{
    botServer.memberAddBotServer(client, member);
}

exports.memberRemoveBotServer = (client, member) =>
{
    botServer.memberRemoveBotServer(client, member);
}