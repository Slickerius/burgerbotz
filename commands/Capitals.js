const res = require(`../resources/ResourcesManager.js`);

exports.headers =
{
    name: `Capitals`,
    aliases: [`capitals`],
    desc: `Guess capital cities and earn burgers!`,
    category: `fun`,
    usage: `/capitals`
};

exports.run = (client, message, args) =>
{
    let { content, author, channel } = message;

    if(!client.capitalChannels.get(channel))
    {
        let capital = res.getRandomCapital();
        channel.send(`:earth_americas: __***Capitals of the World***__ :earth_asia:\n*You have 15 seconds to guess the name of the capital city!*\n**Difficulty: ${capital[2]}**\nWhat is the capital city of **${capital[0]}**?`);
        client.capitalChannels.set(channel, capital);
        client.capitalTimeout = setTimeout(() =>
        {
            channel.send(`:alarm_clock: **Time's up!** No one answered correctly. Answer: **${capital[1]}**`);
            client.capitalChannels.set(channel, ``);
        }, 15000);
    } else {
        channel.send(`:octagonal_sign: **A capital city guessing game is already underway!**`);
    }
}