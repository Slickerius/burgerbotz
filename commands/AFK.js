const afk = require(`../handlers/AFKHandler.js`);

exports.headers =
{
    name: `Away From Keyboard`,
    aliases: [`afk`],
    desc: `Set away from keyboard status.`,
    category: `utility`,
    usage: `/afk <status>`
};

exports.run = (client, message, args) =>
{
    let { content, author, channel } = message;

    if(client.afk.get(author)) return afk.cancel(client, message);

    client.afk.set(author, args.join(` `) || ` `);
    if(args.length < 1)
    {
        channel.send(`:footprints: **${author.username}** is now AFK`);
    } else {
        channel.send(`:footprints: **${author.username}** is now AFK (**"${args.join(` `)}"**)`);
    }
}