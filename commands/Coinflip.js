const mongoose = require(`mongoose`);
const UserProfile = require(`../models/UserProfile.js`);

const coinflip = require(`../handlers/CoinflipHandler.js`);

exports.headers =
{
    name: `Coinflip`,
    aliases: [`coinflip`],
    desc: `Flip a coin!`,
    category: `fun`,
    usage: `/coinflip <bet amount>`
};

exports.run = (client, message, args) =>
{
    if(args[0] != parseInt(args[0])) return message.channel.send(`:dollar: **Correct usage: ${exports.headers.usage}**`);
    if(parseInt(args[0]) < 1) return message.channel.send(`:octagonal_sign: **You may only enter a positive value!**`);

    UserProfile.findOne(
    {
        id: message.author.id
    }, (err, profile) =>
    {
        if(profile.burgers < parseInt(args[0])) return message.channel.send(`:octagonal_sign: **You have insufficient burgers to make this bet**`);
        
        message.channel.send(`:money_with_wings: __**Coinflip**__ :money_with_wings:\n**Stake: :hamburger: ${parseInt(args[0])}**\nChoose: heads/tails (h/t)`);
        client.coinChoice.set(message.author, ` `);
        coinflip.setStake(message.author, parseInt(args[0]));

        profile.burgers -= parseInt(args[0]);
        profile.save();
    });
}