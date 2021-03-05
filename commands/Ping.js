exports.headers =
{
    name: `Ping`,
    aliases: [`ping`],
    desc: `Pong!`,
    category: `bot`,
    usage: `/ping`
};

exports.run = (client, message, args) =>
{
    return message.channel.send(`**PONG!** Returned request in ${(Date.now() - message.createdTimestamp)} ms`);
};