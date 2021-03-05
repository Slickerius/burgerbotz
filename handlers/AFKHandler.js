exports.cancel = (client, message) =>
{
    let { content, author, channel } = message;

    channel.send(`:footprints: **${author.username}** is no longer AFK`);
    return client.afk.set(author, ``);
}

exports.notify = (client, message, user) =>
{
    let { content, author, channel } = message;
    if(client.afk.get(user) == ` `)
    {
        channel.send(`:footprints: **${user.username}** is away from keyboard`);
    } else {
        channel.send(`:footprints: **${user.username}** is away from keyboard (**"${client.afk.get(user)}"**)`);
    }
}