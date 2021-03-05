exports.echo = (client, message) =>
{
    let { channel, author, content } = message;
    for(let key of client.phoneChannels.keys())
    {
        if(client.phoneChannels.get(key) == client.phoneChannels.get(channel) && key != channel)
        {
            key.send(`**[${client.phoneChannels.get(channel)}] ${author.username}#${author.discriminator}:** ${content}`);
        }
    }
}

exports.join = (client, room) =>
{
    for(let key of client.phoneChannels.keys())
    {
        if(client.phoneChannels.get(key) == room)
        {
            key.send(`:telephone: **Someone new has joined the room! Say hello!**`);
        }
    }
}