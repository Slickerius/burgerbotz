const utils = require(`../Utils.js`);
const UserProfile = require(`../models/UserProfile.js`);

exports.run = (client, message) =>
{
    let { content, author, channel } = message;
    let flag = client.flagChannels.get(channel);
    if(content.toLowerCase().includes(flag[1].toLowerCase()))
    {
        let prize = utils.randomise(1, 5);
        let modifier = utils.randomise(1, 4);
        prize += modifier * flag[4];

        channel.send(`:trophy: **${author.username}** has guessed correctly! Answer: **${flag[1]}**\n**Prize: :hamburger: ${prize}**`);
        clearTimeout(client.flagTimeout);
        client.flagChannels.set(channel, ``);

        UserProfile.findOne(
        {
            id: author.id
        }, (err, profile) =>
        {
            profile.burgers += prize;
            profile.save();
        });
    }
}