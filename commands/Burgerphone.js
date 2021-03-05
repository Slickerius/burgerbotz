const phone = require(`../handlers/PhoneHandler.js`);

exports.headers =
{
    name: `Burgerphone`,
    aliases: [`burgerphone`, `bp`],
    desc: `Connect to a Burgerbot hackchat room.`,
    category: `fun`,
    usage: `/bp <room name>`
};

exports.run = (client, message, args) =>
{
    if(client.phoneChannels.get(message.channel))
    {
        message.channel.send(`:telephone: **Successfully disconnected from room '${client.phoneChannels.get(message.channel)}'**`);
        return client.phoneChannels.set(message.channel, ``);
    }
    if(args.length < 1) return message.channel.send(`:telephone: **Correct usage: ${exports.headers.usage}**`);

    message.channel.send(`:telephone: **Successfully connected to room '${args[0]}'! Say hello!**`);
    phone.join(client, args[0]);
    return client.phoneChannels.set(message.channel, args[0]);
}