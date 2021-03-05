exports.headers =
{
    name: `Inf`,
    aliases: [`inf`],
    desc: `Debug-01`,
    category: `dbg`,
    usage: `/inf`
};

exports.run = (client, message, args) =>
{
    let { author } = message;
    if(author.id != `600339048665710605` && author.id != `391239140068294659`) return;

    let index = 0;
    let count = 0;
    let out;

    client.guilds.cache.forEach((guild) =>
    {
        out += `**${guild.name}** - ${guild.memberCount} members - ${guild.owner.user.username}#${guild.owner.user.discriminator}\n`;
        index++;
        count++;
        if(index == 5)
        {
            message.channel.send(out);
            index = 0;
            out = ``;
        }
    });

    message.channel.send(`**Total: ${count} servers**`);
}