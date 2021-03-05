const mongoose = require(`mongoose`);
const UserProfile = require(`../models/UserProfile.js`);

exports.headers =
{
    name: `Balance`,
    aliases: [`burgers`, `bal`, `balance`],
    desc: `Check your balance status.`,
    category: `economy`,
    usage: `/balance <user>`
};

exports.run = (client, message, args) =>
{
    let { content, author, channel } = message;

    let user;

    if(message.mentions.users.size < 1)
    {
        user = author;
    } else {
        user= message.mentions.users.first();
    }

    UserProfile.findOne(
    {
        id: user.id
    }, (err, profile) =>
    {
        if(!profile)
        {
            const newProfile = new UserProfile(
            {
                id: user.id,
                burgers: 10
            });

            channel.send(`:diamond_shape_with_a_dot_inside:  **${user.username}**'s balance contains :hamburger: **10**`);
            newProfile.save();
        } else {
            channel.send(`:diamond_shape_with_a_dot_inside:  **${user.username}**'s balance contains :hamburger: **${profile.burgers.toFixed(2)}**`);
        }
    });

}