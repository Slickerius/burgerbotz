const utils = require(`../Utils.js`);
const UserProfile = require(`../models/UserProfile.js`);

exports.run = (client, message) =>
{
    let { content, author, channel } = message;
    let capital = client.capitalChannels.get(channel);
    if(content.toLowerCase().includes(capital[1].toLowerCase()))
    {
        let prize = utils.randomise(1, 5);
        let modifier = utils.randomise(1, 4);
        prize += modifier * capital[3];

        channel.send(`:trophy: **${author.username}** has guessed correctly! Answer: **${capital[1]}**\n**Prize: :hamburger: ${prize}**`);
        clearTimeout(client.capitalTimeout);
        client.capitalChannels.set(channel, ``);

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