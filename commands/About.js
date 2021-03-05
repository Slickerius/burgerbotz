const embeds = require(`../Embeds.js`);

exports.headers =
{
    name: `About`,
    aliases: [`about`],
    desc: `About Burgerbotz!`,
    category: `bot`,
    usage: `/about`
}

exports.run = (client, message, args) =>
{
    message.channel.send(embeds.getAbout());
}