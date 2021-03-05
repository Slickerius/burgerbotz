exports.headers =
{
    name: `Post`,
    aliases: [`post`],
    desc: `Post a message.`,
    category: `utility`,
    usage: `/post <message>`
};

exports.run = (client, message, args) =>
{
    if(args.length < 1)
    {
        return message.channel.send(`:robot: **Correct usage: /post <message>**`);
    }
    console.log(message.content.split(` `).shift())
    return message.channel.send(message.content.split(` `).slice(1).join(` `));
}