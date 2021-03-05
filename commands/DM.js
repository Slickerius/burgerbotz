exports.headers =
{
    name: `Direct Message`,
    aliases: [`dm`],
    desc: `Send DM to a user.`,
    category: `utility`,
    usage: `/dm <user> <message>`
};

exports.run = (client, message, args) =>
{
    const msg = message.content.trim().split(/ +/g);
    msg.shift();
    if(message.mentions.users.size < 1 || `<@${message.mentions.users.first().id}>` != args[0] && `<@!${message.mentions.users.first().id}>` != args[0])
    {
        message.channel.send(`:envelope: **Correct usage: ${exports.headers.usage}**`);
        console.log(args[0]);
    } else {
        let user = message.mentions.users.first();
        if(user.bot) return message.channel.send(`:octagonal_sign: **You may only send direct messages to humans!**`);
        msg.shift();

        user.send(msg.join(` `));
        return message.channel.send(`:incoming_envelope: **Message sent!**`);
    }
}