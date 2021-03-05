const embeds = require(`../Embeds.js`);

exports.headers =
{
    name: `Help`,
    aliases: [`help`],
    desc: `Show the help screen.`,
    category: `bot`,
    usage: `/help`
};

exports.run = (client, message, args) =>
{
    let { channel } = message;

    return channel.send(embeds.getHelp(client, args[0]));
}
