const res = require(`../resources/ResourcesManager.js`);

exports.headers =
{
    name: `Flags`,
    aliases: [`flags`],
    desc: `Guess flag names and earn burgers!`,
    category: `fun`,
    usage: `/flags`
};

exports.run = (client, message, args) =>
{
    let { content, author, channel } = message;

    if(!client.flagChannels.get(channel))
    {
        let flag = res.getRandomFlag();
        channel.send(`:checkered_flag: __***Flagspotting***__ :checkered_flag:\n*You have 15 seconds to guess the flag!*\n**Category: ${flag[2]}**\n**Difficulty: ${flag[3]}**`);
        channel.send(flag[0]);
        client.intelChannel.send(flag[1]);
        client.flagChannels.set(channel, flag);
        client.flagTimeout = setTimeout(() =>
        {
            channel.send(`:alarm_clock: **Time's up!** No one answered correctly. Answer: **${flag[1]}**`);
            client.flagChannels.set(channel, ``);
        }, 15000);
    } else {
        channel.send(`:octagonal_sign: **A flagspotting game is already underway!**`);
    }
}